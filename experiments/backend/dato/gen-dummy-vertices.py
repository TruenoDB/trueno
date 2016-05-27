##
#  author: ebarsallo                         
#  Generate dump data for vertices to import on cassandra. 
#  Suggested input: wiki-Talk.txt (list of vertices -- one vertice per line).
#  module: experiments/backend
#
#  Note:
#  Dummy data generated using: https://pypi.python.org/pypi/fake-factory

import sys, getopt
import csv
import os.path

from random import randint
from faker  import Faker

PRG_NAME = 'gen-dummy-vertices.py'


fake = Faker()

# generate random data
def gen_random (t, n):

	if n == 0: return ''

	# start
	first = True
	line  = ''
	for x in range(n):
		if not first:
			line = line + ', '
			
		line = line + "'%(a)s%(b)d': ('text', '%(c)s')" % {'a': t, 'b': x, 'c': fake.sentence(2)}
		first = False
	
	return line


# main
def main(argv):

	inputfile = ''

	try:
		opts, args = getopt.getopt(argv,"hi:o",["ifile=","ofile="])

	except getopt.GetoptError:
		print PRG_NAME, ' -i <inputfile>'
		sys.exit(2)

	for opt, arg in opts:
		if opt == '-h':
			print PRG_NAME, ' -i <inputfile>'
			sys.exit()
		elif opt in ("-i", "--ifile"):
			inputfile = arg

	if not os.path.isfile (inputfile):
		print 'file: ', inputfile,' does not exists.'
		sys.exit(2)

	# processing csv
	with open (inputfile, 'r') as csvfile:
		reader = csv.reader (csvfile, delimiter='\t', quotechar='"')

		for row in reader:

			vertex = row[0]

			attr = randint(0,9)
			meta = randint(0,9)

			print vertex + ',1,\"{' + gen_random('attribute', attr) + '}\",\"{}\",\"{' + gen_random('metadata', meta) + '}\"'


if __name__ == "__main__":
	main(sys.argv[1:])