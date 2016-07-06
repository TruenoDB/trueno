##
#  author: ebarsallo                         
#  Generate dump data for edges to import on cassandra. 
#  Suggested input: A file with a list of vertex (a vertex per line).
#  module: experiments/backend
#
#  Note:
#  Dummy data generated using: https://pypi.python.org/pypi/fake-factory

import sys, getopt
import csv
import os.path

from dummy import gen_random_data, gen_random_tuple
from random import randint

PRG_NAME = 'gen-dummy-vertices.py'


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

			node = row[0]
		
			attr = randint(0,9)
			meta = randint(0,9)
			part = 1;

			tup = "%(vertex)s,\"{%(attr_map)s}\",\"{%(comp_map)s}\",\"{%(metadata)s}\",%(partition)s" % { 
						'vertex'    : node, 
					    'attr_map'  : gen_random_tuple('attribute', attr), 
					    'comp_map'  : '',
					    'metadata'  : gen_random_tuple('metadata', meta),
					    'partition' : part}
					    

			print tup


if __name__ == "__main__":
	main(sys.argv[1:])