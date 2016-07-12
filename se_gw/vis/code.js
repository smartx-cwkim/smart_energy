$(function(){ // on dom ready

var cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'width': 'data(width)',
        'height': 'data(height)',
        'content': 'data(name)',
        'text-valign': 'center',
        'text-halign': 'right',
        'background-color': 'data(faveColor)'
      })
    .selector('edge')
      .css({
        'target-arrow-shape': 'triangle',
        'width': 5,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd',
        'curve-style': 'bezier'
      }),
  
  elements: {
      nodes: [
        { data: { id: 'n1' , name: 'x', width: 50, height: 50, faveColor: '#11479e' } },
        { data: { id: 'n2' , name: 'y', width: 50, height: 50, faveColor: '#11479e' } },
        { data: { id: 'n3' , name: 'z', width: 50, height: 50, faveColor: '#86B342' } },
        { data: { id: 'n4' , name: 'k', width: 50, height: 50, faveColor: '#11479e' } },
      ], 
      
      edges: [
        { data: { id: 'ab', source: 'n1', target: 'n2' } },
        { data: { id: 'bc', source: 'n2', target: 'n3' } },
        { data: { id: 'cd', source: 'n3', target: 'n4' } },
      ]
    },
  
  layout: {
    name: 'breadthfirst',
    directed: true,
    padding: 10
  }
});
  
var eles = cy.elements();

var highlightNextEle = function(){
  var timer = 0;
  var i = 2; // 노드의 순서라고 생각하면 됨.
  
  var jAni = cy.nodes()[i].animation({
  style: {
    'background-color': 'red',
    'width': 100,
    'height': 100
  },
  duration: 1000
});
  
  for(i=0;i<eles.length;i++) {
    jAni.play();
    jAni.completed();
  }
};

// kick off first highlight
highlightNextEle();

}); // on dom ready
