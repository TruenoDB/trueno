##
#  author: ebarsallo                         
#  Utils functions used to generate dump data to import on cassandra. 
#  Suggested input: wiki-Talk.txt 
#  module: experiments/backend
#
#  Note:
#  Dummy data generated using: https://pypi.python.org/pypi/fake-factory


from random import randint
from faker  import Faker
fake = Faker()


# generate random data
def gen_random_data ():

	type = randint(0,2);

	if type == 0:
		return "{type: 'text',    value: '%(val)s'}" % {'val': fake.sentence(2)}
	elif type == 1:
		return "{type: 'number',  value: '%(val)s'}" % {'val': randint(0,99999)}
	elif type == 2:
		bol = 'true' if randint(0,1) == 1 else 'false'
		return "{type: 'boolean', value: '%(val)s'}" % {'val': bol}


# generate a random tuple
def gen_random_tuple (t, n):

	if n == 0: return ''

	# start
	first = True
	line  = ''
	for x in range(n):
		if not first:
			line = line + ', '
			
		# generate random type (text, number, boolean)
		randint(0,3)


		line = line + "'%(a)s%(b)d': " % {'a': t, 'b': x} 
		line = line + str(gen_random_data());
		first = False
	
	return line