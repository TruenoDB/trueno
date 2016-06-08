"use strict";

/**
 * @author ebarsallo
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const Promise = require('bluebird');
const fs = require('fs');
const trueno = require('../trueno-graph-simple');

const Graph = require('../../core/data_structures/graph');
const Vertex = require('../../core/data_structures/vertex');
const Edge = require('../../core/data_structures/edge');

/** Description of the class */
class GraphOfTheGodsFactory {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._property = param.prop || 'someValue';
  }


  /**
   * Create objects from Graph Of The Gods example on the backend.
   */
  load() {

    let g = new trueno({graph : 'titan'});

    // Create graph
    let graph = new Graph({id : 'titan'})
    g.addGraph(graph);

    // FIXME
    // Simplify methods.

    // vertices
    let saturn = new Vertex({id: 1});
    saturn.setAttribute('label', 'titan');
    saturn.setAttribute('name', 'saturn');
    saturn.setAttribute('age', 10000);
    g.addVertex (saturn);

    let sky = new Vertex({id: 2});
    sky.setAttribute('label', 'location');
    sky.setAttribute('name', 'sky');
    g.addVertex (sky);

    let sea = new Vertex({id: 3});
    sea.setAttribute('label', 'location');
    sea.setAttribute('name', 'sea');
    g.addVertex (sea);

    let jupiter = new Vertex({id: 4});
    jupiter.setAttribute('label', 'god');
    jupiter.setAttribute('name', 'jupiter');
    jupiter.setAttribute('age', 5000);
    g.addVertex (jupiter);

    let neptune = new Vertex({id: 5});
    neptune.setAttribute('label', 'god');
    neptune.setAttribute('name', 'neptune');
    neptune.setAttribute('age', 4500);
    g.addVertex (neptune);

    let hercules = new Vertex({id: 6});
    hercules.setAttribute('label', 'demigod');
    hercules.setAttribute('name', 'hercules');
    hercules.setAttribute('age', 30);
    g.addVertex (hercules);

    let alcmene = new Vertex({id: 7});
    alcmene.setAttribute('label', 'human');
    alcmene.setAttribute('name', 'alcmene');
    alcmene.setAttribute('age', 45);
    g.addVertex (alcmene);

    let pluto = new Vertex({id: 8});
    pluto.setAttribute('label', 'god');
    pluto.setAttribute('name', 'pluto');
    pluto.setAttribute('age', 4000);
    g.addVertex (pluto);

    let nemean = new Vertex({id: 9});
    nemean.setAttribute('label', 'monster');
    nemean.setAttribute('name', 'nemean');
    g.addVertex (nemean);

    let hydra = new Vertex({id: 10});
    hydra.setAttribute('label', 'monster');
    hydra.setAttribute('name', 'hydra');
    g.addVertex (hydra);

    let cerberus = new Vertex({id: 11});
    cerberus.setAttribute('label', 'monster');
    cerberus.setAttribute('name', 'cerberus');
    g.addVertex (cerberus);

    let tartarus = new Vertex({id: 12});
    tartarus.setAttribute('label', 'location');
    tartarus.setAttribute('name', 'tartarus');
    g.addVertex (tartarus);


    console.log('add edges ...');


    // edges
    /* jupiter */
    let edge1 = jupiter.addEdge(saturn);
    edge1.setAttribute('label', 'father');
    g.addEdge(edge1);

    let edge2 = jupiter.addEdge(sky);
    edge2.setAttribute('label', 'lives');
    edge2.setAttribute('reason', 'loves fresh breezes');
    g.addEdge(edge2);

    let edge3 = jupiter.addEdge(neptune);
    edge3.setAttribute('label', 'brother');
    g.addEdge(edge3);

    let edge4 = jupiter.addEdge(pluto);
    edge4.setAttribute('label', 'brother');
    g.addEdge(edge4);

    /* neptune */
    let edge5 = neptune.addEdge(sea);
    edge5.setAttribute('reason', 'loves waves');
    g.addEdge(edge5);

    let edge6 = neptune.addEdge(jupiter);
    edge6.setAttribute('label', 'brother');
    g.addEdge(edge6);

    let edge7 = neptune.addEdge(pluto);
    edge7.setAttribute('label', 'brother');
    g.addEdge(edge7);

    /* hercules */
    let edge8 = hercules.addEdge(jupiter);
    edge8.setAttribute('label', 'father');
    g.addEdge(edge8);

    let edge9 = hercules.addEdge(alcmene);
    edge9.setAttribute('label', 'mother');
    g.addEdge(edge9);

    let edge10 = hercules.addEdge(nemean);
    edge10.setAttribute('label', 'battled');
    edge10.setAttribute('time', '1');
    edge10.setAttribute('place', 'Geoshape.point(38.1f, 23.7f)');
    g.addEdge(edge10);

    let edge11 = hercules.addEdge(hydra);
    edge11.setAttribute('label', 'battled');
    edge11.setAttribute('time', '2');
    edge11.setAttribute('place', 'Geoshape.point(37.7f, 23.9f)');
    g.addEdge(edge11);

    let edge12 = hercules.addEdge(cerberus);
    edge12.setAttribute('label', 'battled');
    edge12.setAttribute('time', '12');
    edge12.setAttribute('place', 'Geoshape.point(39f, 22f)');
    g.addEdge(edge12);

    /* pluto */
    let edge13 = pluto.addEdge(jupiter);
    edge13.setAttribute('label', 'brother');
    g.addEdge(edge13);

    let edge14 = pluto.addEdge(neptune);
    edge14.setAttribute('label', 'brother');
    g.addEdge(edge14);

    let edge15 = pluto.addEdge(tartarus);
    edge15.setAttribute('label', 'lives');
    edge15.setAttribute('reason', 'no fear of death');
    g.addEdge(edge15);

    let edge16 = pluto.addEdge(cerberus);
    edge16.setAttribute('label', 'pet');
    g.addEdge(edge16);

    /* cerberus */
    let edge17 = cerberus.addEdge(tartarus);
    edge17.setAttribute('label', 'lives');
    g.addEdge(edge17);

    g.close();

  };


}


/* exporting the module */
module.exports = GraphOfTheGodsFactory;
