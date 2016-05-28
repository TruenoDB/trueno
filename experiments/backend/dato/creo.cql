/* Main database structures */

/*
  computed     map
  ------------------------------------
		* intermediate results from analytic algorithms (eg. pageranks, traingle count, etc)
		* levels (3):
			1* algorithm
			2* property (rank/count)
			3* tuple: value / type

  attributes   map
  ------------------------------------
		* attrib.
		* levels (2):ls -
			1* name
			2* tuple: value/type

 */


/* graph */
CREATE TABLE graph(
	id         int PRIMARY KEY,
	computed   map <text, frozen<map  <text, frozen <tuple<text, text>>>>>,
	attributes map <text, frozen<tuple<text, text>>>,
	meta       map <text, frozen<tuple<text, text>>>
);

/* vertices */
CREATE TABLE vertices(
	id         int,
	partition  int,
	computed   map<text, frozen<map  <text, frozen <tuple<text, text>>>>>,
	attributes map<text, frozen<tuple<text, text>>>,
	meta       map<text, frozen<tuple<text, text>>>,

	PRIMARY KEY (id, partition)
);


/* edges */
CREATE TABLE edges(
	fromv      bigint,
	tov        bigint,
	partition  int,
	computed   map<text, frozen<map  <text, frozen <tuple<text, text>>>>>,
	attributes map<text, frozen<tuple<text, text>>>,
	meta       map<text, frozen<tuple<text, text>>>,

	PRIMARY KEY (fromv, tov)
);
