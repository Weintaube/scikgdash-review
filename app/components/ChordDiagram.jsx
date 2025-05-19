import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ChordDiagram = ({ nodes, links, onNodeClick }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const width = 800;
  const height = 600;
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', zoomed));

    const g = d3.select(gRef.current)
      .attr('transform', `translate(${width / 2},${height / 2})`);

    function zoomed(event) {
      g.attr('transform', event.transform);
    }

    // Create a chord layout
    const chord = d3.chordDirected()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

    // Initialize matrix with zeros
    const matrix = Array.from({ length: nodes.length }, () => Array(nodes.length).fill(0));

    // Map links to matrix
    links.forEach(link => {
      const sourceIndex = nodes.findIndex(node => node.id === link.source);
      const targetIndex = nodes.findIndex(node => node.id === link.target);
      matrix[sourceIndex][targetIndex] += link.value;
    });

    // Compute chords layout
    const chords = chord(matrix);

    // Add arcs for each node
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // Add ribbons for each link
    const ribbon = d3.ribbonArrow()
      .radius(innerRadius);

    // Color scale for nodes
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw groups (arcs)
    g.selectAll('.arc')
      .data(chords.groups, d => d.index) // Use index as key for data binding
      .join('path')
      .attr('class', 'arc')
      .attr('fill', d => color(d.index))
      .attr('d', arc)
      .on('click', (event, d) => handleNodeClick(d.index));

    // Draw chords (ribbons)
    g.selectAll('.ribbon')
      .data(chords, d => `${d.source.index}-${d.target.index}`) // Use source-target pair as key
      .join('path')
      .attr('class', 'ribbon')
      .attr('fill', d => color(d.target.index))
      .attr('d', ribbon);

    // Add labels for nodes
    g.selectAll('.label')
      .data(chords.groups, d => d.index) // Use index as key for data binding
      .join('text')
      .attr('class', 'label')
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '.35em')
      .attr('transform', d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 10})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
      .text(d => nodes[d.index].id)
      .attr('cursor', 'pointer') // Change cursor to pointer
      .style('fill', (d, i) => i === activeIndex ? 'red' : 'black') // Default and active color
      .on('mouseover', function(event, d) {
        d3.select(this).style('fill', 'red'); // Hover color
      })
      .on('mouseout', function(event, d) {
        d3.select(this).style('fill', d.index === activeIndex ? 'red' : 'black'); // Revert to active or default color
      })
      .on('click', (event, d) => {
        handleNodeClick(d.index);
      });

    function handleNodeClick(index) {
      setActiveIndex(index); // Set active index on click
      const outgoingFrequency = d3.sum(matrix[index]); 
      const incomingFrequency = d3.sum(matrix.map(row => row[index]));
      const nodeData = {
        id: nodes[index].id,
        incomingFrequency: incomingFrequency,
        outgoingFrequency: outgoingFrequency,
        totalFrequency: outgoingFrequency + incomingFrequency, // Total frequency
        incoming: links.filter(link => link.target === nodes[index].id),
        outgoing: links.filter(link => link.source === nodes[index].id),
      };
      onNodeClick(nodeData);
    }

    return () => {
      svg.on('.zoom', null); // Remove zoom behavior
    };
  }, [nodes, links, width, height, onNodeClick, activeIndex]);

  return (
    <svg className="border-2" ref={svgRef}>
      <g ref={gRef} />
    </svg>
  );
};

export default ChordDiagram;
