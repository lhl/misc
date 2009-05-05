/** SkipList
 *
 * Task: JavaScript implementation of a skiplist
 * 
 * A skiplist is a randomized variant of an ordered linked list with
 * additional, parallel lists.  Parallel lists at higher levels skip
 * geometrically more items.  Searching begins at the highest level, to quickly
 * get to the right part of the list, then uses progressively lower level
 * lists. A new item is added by randomly selecting a level, then inserting it
 * in order in the lists for that and all lower levels. With enough levels,
 * searching is O( log n).
 *
 * Skip lists are similar to linked lists, except that they have random links
 * at various levels that allow searches to skip over sections of the list,
 * like so:
 *
 *   4 +---------------------------> +----------------------> +
 *     |                             |                        |
 *   3 +------------> +------------> +-------> +-------> +--> +
 *     |              |              |         |         |    |
 *   2 +-------> +--> +-------> +--> +--> +--> +-------> +--> +
 *     |         |    |         |    |    |    |         |    |
 *   1 +--> +--> +--> +--> +--> +--> +--> +--> +--> +--> +--> +
 *          A    B    C    D    E    F    G    H    I    J   NIL
 *
 * A search would start at the top level: if the link to the right exceeds the
 * target key, then it descends a level.
 *
 * Skip lists generally perform as well as balanced trees for searching but do
 * not have the overhead with respect to inserting new items.
 *
 * 
 * Ref: NIST Dictionary of Algorithms and Data Structures: Skip Lists
 * http://www.nist.gov/dads/HTML/skiplist.html
 *      
 *      Skip Lists: A Probabilistic Alternative to Balanced Trees
 *      http://citeseer.ist.psu.edu/521847.html
 *      ftp://ftp.cs.umd.edu/pub/skipLists/
 *
 *      University of Melbourne: Algorithms in Action
 *      http://www.cs.mu.oz.au/aia/
 *
 *      CPAN Algorithm-SkipList-1.01
 *      http://search.cpan.org/~rrwo/Algorithm-SkipList-1.01/
 *
 *  Notes:
 *    * some of the variable names, like forward and update changed from
 *      Pugh's paper to some that made more sense to me while I was working w/
 *      understanding the algorithm
 *
 */

function SLNode(level, key, value) {
  this.key = key;
  this.value = value;
  this.pointer = new Array(level); // Array used for working .length
}

function SkipList(maxLevel, P) {
  // Properties
  this.maxLevel = maxLevel ? maxLevel : 8;
  this.P = P ? P : 0.25;               

  // Init
  this.currentLevel = 0;

  // Head
  this.Head = new SLNode(this.maxLevel, Number.MIN_VALUE, 0);

  // Nil & link to Head
  this.Nil = new SLNode(this.maxLevel, Number.MAX_VALUE, 0);
  for(var i=0; i<=this.maxLevel; i++) {
    this.Head.pointer[i] = this.Nil;
  }


  this.Insert = function(key, value) {
    var cursor = this.Head;
    var next = new Array(cursor.pointer.length); // size of maxLevels

    // Search the SkipList
    // Follow from longest link for max efficiency
    for(var i=this.currentLevel; i>=0; i--) {
      // Search through each level to the end of the linked list
      // while the node's key is less than the inserted key
      while(cursor.pointer[i].key < key) {
        cursor = cursor.pointer[i];
      }
      // keep track of where the next element points to (------->)
      next[i] = cursor;
    }

    // ok, we have next[] and cursor set, now advance
    cursor = cursor.pointer[0];

    // dup handling - overwrite the sucker
    if(cursor.key == key) {
      cursor.value = value;
    }

    // or insert a new element
    else {
      // Generate random level
      var rLevel = this.randomLevel();

      if(rLevel > this.currentLevel) {
        for(i=this.currentLevel+1; i<=rLevel; i++) {
          next[i] = this.Head;
        }

        // set new level
        this.currentLevel = rLevel;
      }
      
      // save the new element @ cursor and push links
      cursor = new SLNode(rLevel, key, value);
      for(i=0; i<=rLevel; i++) {
        cursor.pointer[i] = next[i].pointer[i];
        next[i].pointer[i] = cursor;
      }
    }
  }

  this.Search = function(key) {
    var cursor = this.Head;

    for(var i=this.currentLevel; i>=0; i--) {
      var x = cursor.pointer[i];
      while(x.key < key) {
        cursor = x;
        x = cursor.pointer[i];
      }
    }
    cursor = cursor.pointer[0];

    if(cursor.key == key) {
      return cursor.value // WINNER
    } else {
      return false;
    }
  }

  this.Delete = function(key) {
    var cursor = this.Head;
    var next = new Array(cursor.pointer.length); // size of maxLevels

    for(var i=this.currentLevel; i>=0; i--) {
      var x = cursor.pointer[i];
      while(x.key < key) {
        cursor = x;
        x = cursor.pointer[i];
      }
      next[i] = cursor;
    }
    cursor = cursor.pointer[0];

    if(cursor.key == key) {
      // found, lets drop it from the list
      for(i=0; i<=this.currentLevel; i++) {
        if(next[i].pointer[i] == cursor) {
          next[i].pointer[i] = cursor.pointer[i];
        }
      }
      cursor = null; // free(x)

      // Check if we have to lower level
      while(this.currentLevel>0 && this.Head.pointer[this.currentLevel].key == null) {
        this.currentLevel--;
      }

    }
  }

  this.randomLevel = function() {
    // level and MaxLevel are 0 based for easy array index mapping
    var index = this.maxLevel - 1;
    var level = 0;
    while(Math.random() < this.P && level < index) { // See Fig 5
      level++;
    }
    return level;
  }
}


