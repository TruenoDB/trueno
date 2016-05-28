 /* vertices */
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 1, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'jupiter'), 'age' : ('int',  '5000'), 'type' : ('text', 'god')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 2, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'saturn'),  'age' : ('int', '10000'), 'type' : ('text', 'titan')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 3, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'sky'), 'type' : ('text', 'location')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 4, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'sea'), 'type' : ('text', 'location')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 5, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'neptune'), 'age' : ('int', '4500'), 'type' : ('text', 'god')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 6, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'hercules'),'age' : ('int', '30'),   'type' : ('text', 'demigod')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 7, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'alcmene'), 'age' : ('int',  '45'),  'type' : ('text', 'human')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 8, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'pluto'),  'age' : ('int', '4000'), 'type' : ('text', 'god')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES ( 9, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'nermean'),   'type' : ('text', 'monster')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES (10, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'hydra'),     'type' : ('text', 'monster')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES (11, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'cerberus'),  'type' : ('text', 'monster')}, {'meta' : ('text', 'none')});
INSERT INTO vertices (id, partition, computed, attributes, meta) VALUES (12, 1, {'pagerank' : {'rank' : ('double', '9.999999')}}, {'name' : ('text', 'tartarius'), 'type' : ('text', 'location')}, {'meta' : ('text', 'none')});

 /* edges */
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 1, 1, 2, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'father')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 2, 1, 3, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'lives'), 'reason' : ('text', 'loves fresh breezes')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 3, 1, 5, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'brother')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 4, 1, 8, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'brother')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 5, 5, 1, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'brother')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 6, 5, 4, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'lives'), 'reason' : ('text', 'loves waves')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 7, 5, 8, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'brother')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 8, 6, 1, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'father')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES ( 9, 6, 7, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'mother')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (10, 6, 9, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'battled'), 'time' : ('int', '1'), 'place' : ('set', '[38.1, 23.7]]' )}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (11, 6,10, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'battled'), 'time' : ('int', '2'), 'place' : ('set', '[37.7, 23.9]]' )}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (12, 6,11, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'battled'), 'time' : ('int', '12'),'place' : ('set', '[39, 22]]'     )}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (13, 8, 1, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'brother')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (14, 8, 5, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'brother')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (15, 8,11, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'pet')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (16, 8,12, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'lives'), 'reason' : ('text', 'no fear of death')}, {'meta' : ('text', 'none')});
INSERT INTO edges (fromv, tov, computed, attributes, meta) VALUES (17,11,12, {'pagerank' : {'rank' : ('double', '9.99999999')}}, {'label' : ('text', 'lives')}, {'meta' : ('text', 'none')});


