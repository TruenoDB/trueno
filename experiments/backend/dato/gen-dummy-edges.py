##
#  author: ebarsallo                         
#  Generate dump data for edges to import on cassandra. 
#  Suggested input: A csv file which represent the edge list (eg. wiki-Talk.txt) 
#  module: experiments/backend
#
#  Note:
#  Dummy data generated using: https://pypi.python.org/pypi/fake-factory

import sys, getopt
import csv
import os.path

from dummy import gen_random_data, gen_random_tuple
from random import randint

PRG_NAME = 'gen-dummy-edges.py'


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

			# print row
			# skip headers
			if len(row) < 2:
				continue

			node_from = row[0]
			node_to   = row[1]

			if not node_from.isdigit():
				continue


			attr = randint(0,9)
			meta = randint(0,9)
			part = 1;

			tup = "%(out_v)s,%(in_v)s,\"{%(attr_map)s}\",\"{%(comp_map)s}\",\"{%(metadata)s}\",%(partition)s" % {
						'out_v'     : node_from, 
					    'in_v'      : node_to, 
					    'attr_map'  : gen_random_tuple('attribute', attr), 
					    'comp_map'  : '',
					    'metadata'  : gen_random_tuple('metadata', meta),
					    'partition' : part}
					    

			print tup


if __name__ == "__main__":
	main(sys.argv[1:])