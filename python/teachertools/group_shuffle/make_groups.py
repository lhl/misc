#!/usr/bin/env python

# <-- THIS IS A COMMENT
# Download Python, change the above line as appropriate:
# http://www.python.org/download/releases/2.6.4/


''' <-- THIS IS A LONG STRING, but can be used for long comments

You'll need to install the following libraries separately
See: 
  http://prefetch.net/blog/index.php/2009/06/21/installing-python-modules-with-easy_install/
  http://pypi.python.org/pypi/setuptools

easy_install xlrd
easy_install statlib
'''


# Libraries - this includes prebuilt functionality
import xlrd
from statlib import stats
import sys


# Main Function - what gets called when the program is run
def main():
  # Load in Students & History
  s = Students("test.xls")



# Students class - stores functionality and data
class Students:
  students = []
  test_q1 = 0
  test_q2 = 0
  test_q3 = 0
  test_q4 = 0
  groups = []

  # constructor - what gets called when a new Students object is created
  def __init__(self, file):
    self.file = file
    self.load()

  def load(self):
    try:
      book = xlrd.open_workbook(self.file)
      sheet = book.sheet_by_index(0)

      # TODO: Load sheet into assoc array

      # Load history

      # Generate Quartiles

      '''
      scoreatpercentile(self, blah)
      give people 50M



      Sort...
      distribute q1 students
      distribute q4, q2, q3  students
        weighting...
        check if in previous group
        check if diligence
        check gender

        Create score for each combination?

      Run via sanity check - sum diligence and swap
      Run gender
      '''

      # Print out final groups
      
    except(Exception):
      print "Couldn't load Student File. Quitting!"
      sys.exit()





### Magic Code (run main) ###
if __name__ == "__main__":
  main()
