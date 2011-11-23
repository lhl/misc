#!/usr/bin/env python

from   Levenshtein import distance, hamming
from   pprint import pprint
from   PIL import Image
import sys

def main():
  u = Unshred('TokyoPanoramaShredded.png')
  u.makeStrips(32)
  u.unshred('unshredded.png')

class Unshred:
  def __init__(self, filename):
    self.image = Image.open(filename)
    (self.width, self.height) = self.image.size
    self.pixels = self.image.load()
    print 'Loaded %s (%d x %d)' % (filename, self.width, self.height)

  def _getColumn(self, col):
    column = '' 
    for i in range(self.height):
      (r, g, b, a) = self.pixels[(col,  i)]
      column += '%0.2X%0.2X%0.2X' % (r, g, b)
    return column

  def _save(self, output):
    unshredded = Image.new('RGBA', self.image.size)
    for strip in range(self.stripcount):
       (x1, y1) = (self.stripwidth * self.ordered[strip], 0)
       (x2, y2) = (x1 + self.stripwidth, self.height)
       source_region = self.image.crop((x1, y1, x2, y2))
       destination_point = (strip * self.stripwidth, 0)
       unshredded.paste(source_region, destination_point)
    unshredded.save('unshredded.jpg', 'JPEG')

  def makeStrips(self, width):
    self.stripwidth = width
    self.strips = {}
    self.stripcount = self.width/width
    for i in range(self.stripcount):
      start = i*width
      end = start + width - 1
      self.strips[i] = {'left': self._getColumn(start),
                        'right': self._getColumn(end) 
                       }
    print '%d strips generated' % len(self.strips)

  def unshred(self, output):
    distances = {}
    totheright = {}

    for key in self.strips:
      min_k = None
      min_d = None
      for key2 in self.strips:
        if key != key2:
          d = distance(self.strips[key]['right'], self.strips[key2]['left'])
          if min_k == None:
            min_k = key2
            min_d = d
          else:
            if d < min_d:
              min_k = key2
              min_d = d
      print '... strip %d closest match is %d (%d)' % (key, min_k, min_d) 
      distances[key] = min_d
      totheright[key] = min_k

    right_most = max(distances, key=distances.get)
    print 'We think that strip %d is the is the right-most strip!' % right_most

    del(totheright[right_most])
    pprint(totheright)
    self.ordered = [right_most]
    while totheright:
      for key in totheright.keys():
        if totheright[key] == self.ordered[0]:
          self.ordered.insert(0, key)
          del(totheright[key])
    print 'Here\'s our order:', self.ordered

    self._save('output')

if __name__ == "__main__":
  main()
