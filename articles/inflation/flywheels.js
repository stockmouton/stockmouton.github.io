drag = simulation => {
  
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

function chart(d3, data, types, nodeRadius, color, drag){

    const links = data.links;
    const nodes = data.nodes;

    viewBoxWidth = 1000
    viewBoxHeight = 500
    centerX = 0
    centerY = 0
  
    const simulation = d3.forceSimulation(nodes)
        // The overall graph is kept in the center (link to the viewbox)
        .force('center', d3.forceCenter(centerX, centerY))
        // Nodes repulse each other
        .force("charge", d3.forceManyBody().strength(-10*nodeRadius))
        // And can't overlap
        .force('collide',d3.forceCollide(1.5*nodeRadius))
        // Add a "spring" force to links
        .force("link", d3.forceLink(links).id(d => d.id).distance(2*nodeRadius));
  
    const svg = d3.create("svg")
        // .attr("width", 360)
        .attr("viewBox", [-viewBoxWidth / 2, -viewBoxHeight / 2, viewBoxWidth, viewBoxHeight])
        .style("font", "12px sans-serif");
  
    // Per-type markers, as they don't inherit styles.
    // We draw little arrows
    svg.append("defs").selectAll("marker")
      .data(types)
      .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", `0 -${nodeRadius} ${2*nodeRadius} ${2*nodeRadius}`)
        .attr("refX", 0)
        .attr("refY", 0)
        // .attr("markerWidth", 6)
        // .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
      .append("path")
        .attr("fill", color)
        .attr("d", `M0,-${nodeRadius} L${2*nodeRadius},0 L0,${nodeRadius}`);
  
    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
        .attr("id", d => `text-${d.id}`)
        // .attr("transform", d => {
        //   `translate(${nodeRadius * d.index},${nodeRadius * d.index})`
        // })
        .call(drag(simulation));


    node.append("circle").lower()
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .attr("fill", color("node"))
        .attr("r", nodeRadius);
    
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", nodeRadius / 8)
      .selectAll("path")
      .data(links)
      .join("path")
        .attr("stroke", d => color(d.type))
        .attr("marker-end", d => `url(#arrow-${d.type})`);

    simulation.on("tick", () => {
      node.attr("transform", d => {
        if (d.fixed === true) {
          return `translate(${d.position[0]},${d.position[1]})`
        } else {
          return `translate(${d.x},${d.y})`
        }
      });

      link.attr("d", d => {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        const unit = [
          (d.target.x - d.source.x) / r, 
          (d.target.y - d.source.y) / r
        ]
        return `
            M ${d.source.x + nodeRadius * unit[0]} ${d.source.y + nodeRadius * unit[1]}
            L ${d.target.x - nodeRadius * unit[0]} ${d.target.y - nodeRadius * unit[1]}
        `;
      });
    });
  
    return svg.node();
  }

htmlNodes = [...document.querySelectorAll(".stockmouton-data")]
counter = 0
htmlNodes.forEach(htmlNode => {
    csv = htmlNode.innerText.trim()
    links = d3.csvParse(csv).map(l => {
        return {
            "source": l.source.trim(),
            "target": l.target.trim(),
            "type": l.type.trim(),
            "position": l.position.trim().split(" "),
        }
    })

    types = Array.from(new Set(links.map(d => d.type.trim())))
    nodesText = new Set(links.flatMap(l => [l.source, l.target]))
    mapping = {}
    nodes = Array.from(
        nodesText, 
        text => {
            counter += 1

            mapping[text] = counter
            return { id: counter, text: text }
        }
    )
    links = links.map(l => {
        return {
            "source": mapping[l.source], // Replace source and targets with ids here
            "target": mapping[l.target], // Replace source and targets with ids here
            "type": l.type,
        }
    })
    data = ({nodes, links})

    color = d3.scaleOrdinal(types, d3.schemePastel1)
    nodeRadius = 40

    svgNode = chart(d3, data, types, nodeRadius, color, drag)
    htmlNode.innerHTML = ""
    htmlNode.append(svgNode)
    htmlNode.style.display = ""

    nodes.forEach(d => {
        new d3plus.TextBox()
            .data([{'text': d.text}])
            // .fontSize(15)
            .width(2 * nodeRadius * 0.8)
            .height(2 * nodeRadius)
            .x(-nodeRadius * 0.8)
            .y(-nodeRadius)
            .textAnchor("middle")
            .verticalAlign("middle")
            .select(`#text-${d.id}`)
            .render();
    })
})