'use strict';

module.exports = [

  {
    name: 'Gene Structure',
    test: function(gene) {
      return true;
    },
    reactClass: require('../browser.jsx')
  },

  {
    name: 'Homology',
    test: function(gene) {
      return !!gene.grm_gene_tree;
    },
    reactClass: require('./homology.jsx')
  },

  {
    name: 'Domains', // for display
    test: function(gene) {
      return gene.domainList || gene.domainRoots;
    },
    reactClass: require('./domains.jsx')
  }

];