import Chart from "./chart.js";


d3.csv('./train2019.csv', function(d){
    return d
}).then(function(data){
    let tmp = [{"id": "California"},{"id": "Maine"},{"id": "Arizona"},
        {"id": "New_York"},{"id": "North_Dakota"},{"id": "Texas"},
        {"id": "Montana"},{"id": "Minnesota"},{"id": "Vermont"},
        {"id": "Washington"},{"id": "Michigan"},
        {"id": "Alaska"},{"id": "Idaho"},{"id": "New_Mexico"},{"id": "Ohio"}]

       let tmp1 = ['Calexico East', 'Van Buren', 'Otay Mesa', 'Nogales',
       'Trout River', 'Madawaska', 'Pembina', 'Progreso', 'Portal',
       'Champlain-Rouses Point', 'Opheim', 'Neche', 'Lancaster',
       'Derby Line', 'Sarles', 'Wildhorse', 'Lynden', 'Vanceboro',
       'San Ysidro', 'Scobey', 'Beecher Falls', 'Calais', 'Massena',
       'Oroville', 'Hansboro', 'Ferry', 'Tecate', 'Eastport', 'Walhalla',
       'Roma', 'Naco', 'Boquillas', 'Raymond', 'Porthill', 'Norton',
       'Sault Sainte Marie', 'Antler', 'Rio Grande City', 'Del Rio',
       'Sasabe', 'Highgate Springs-Alburg', 'Del Bonita', 'Houlton',
       'Metaline Falls', 'Fort Fairfield', 'Noonan', 'Westhope', 'Blaine',
       'Douglas', 'Port Huron', 'Bridgewater', 'Santa Teresa',
       'Lukeville', 'Roseau', 'Skagway', 'Fortuna', 'Frontier',
       'Baudette', 'Fort Kent', 'Grand Portage', 'Buffalo-Niagara Falls',
       'Calexico', 'Pinecreek', 'Northgate', 'Sherwood', 'Laurier',
       'Detroit', 'Jackman', 'Ambrose', 'Turner', 'Dunseith', 'Boundary',
       'Sumas', 'Alexandria Bay', 'Eagle Pass', 'Carbury', 'Sweetgrass',
       'Piegan', 'Tornillo-Fabens', 'El Paso', 'Port Angeles', 'San Luis',
       'Danville', 'Nighthawk', 'Warroad', 'Whitlash', 'Maida',
       'Limestone', 'Andrade', 'Hidalgo', 'Richford', 'Point Roberts',
       'International Falls-Ranier', 'St. John', 'Columbus',
       'Brownsville', 'Presidio', 'Ogdensburg', 'Anacortes', 'Morgan',
       'Willow Creek', 'Roosville', 'Laredo', 'Hannah', 'Ketchikan',
       'Alcan', 'Dalton Cache', 'Cross Border Xpress', 'Friday Harbor',
       'Algonac', 'Portland', 'Cape Vincent', 'Toledo-Sandusky',
       'Whitetail', 'Noyes', 'Bar Harbor']
    for(let i=0;i<tmp1.length;i++){
        let a = tmp1[i].split(" ")
        if(a.length > 1){
            tmp1[i] = a[0] + '_' + a[1]
        }
        tmp.push({"id":tmp1[i]})
        // console.log(tmp1[i])
    }
    // console.log(tmp)
    let relation = []
    for(let k=0;k<data.length;k++){
        let a = data[k]['port'].split(" ")
        if(a.length > 1)
            data[k]['port'] = a[0] + '_' + a[1]
    
        a = data[k]['state'].split(" ")
        if(a.length > 1)
            data[k]['state'] = a[0] + '_' + a[1] 
    
        let re = {"source": data[k]['port'], "target": data[k]['state'], "value": data[k]['value']}
        relation.push(re)
    }
    data = {}
    data.nodes = tmp
    data.links = relation

// // console.log(processec_data)
// d3.json('./data.json').then(function(data){
    console.log(data)
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        margins: {top: 80, left: 50, bottom: 50, right: 50},
        textColor: 'black',
        title: 'SanKeyGraph'
    }

    chart.margins(config.margins);

    /* ----------------------------数据转换------------------------  */
    const sankey = d3.sankey()
                        .nodeWidth(10)
                        .nodePadding(6)
                        .size([chart.getBodyWidth(), chart.getBodyHeight()])
                        .nodeId((d) => d.id);

    const {nodes, links} = sankey({
                                nodes: data.nodes,
                                links: data.links
                            });

    /* ----------------------------渲染节点------------------------  */
    chart.renderNodes = function(){
        const rects = chart.body().append('g')
                                  .attr('class', 'rects')
                                  .selectAll('.node')
                                  .data(nodes);

              rects.enter()
                     .append('g')
                     .attr('class', 'node')
                     .attr('index', (d)=> d.id)
                     .attr('linkNodes', (d)=> {
                         const nextNodes = d.sourceLinks.map((link) => link.target.id).join('');
                         const prevNodes = d.targetLinks.map((link) => link.source.id).join('');
                         return nextNodes + d.id + prevNodes;
                     })
                     .append('rect')
                   .merge(rects)
                     .attr('x', (d) => d.x0)
                     .attr('y', (d) => d.y0)
                     .attr('width', (d) => d.x1 - d.x0)
                     .attr('height', (d) => d.y1 - d.y0)
                     .attr('fill', (d) => chart._colors(d.index % 10));

              rects.exit()
                     .remove();

    }

    /* ----------------------------渲染连线------------------------  */
    chart.renderLines = function(){
        const lines = chart.body().append('g')
                                  .attr('class', 'lines')
                                  .selectAll('path')
                                  .data(links);

               lines.enter()
                      .append('path')
                    .merge(lines)
                      .attr('linkNodes', (d) => d.source.id + '-' + d.target.id)
                      .attr('d', d3.sankeyLinkHorizontal())
                      .attr('stroke', (d) => chart._colors(d.source.index % 10))
                      .attr('stroke-width', (d) => d.width)
                      .attr('stroke-opacity', '0.4')
                      .attr('fill', 'none');

               lines.exit()
                      .remove();
    }

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderTexts = function(){
        d3.selectAll('.text').remove();

        chart.body().selectAll('.node')
                        .append('text')
                        .attr('class', 'text')
                        .attr('x', (d) => (d.x0 + d.x1)/2)
                        .attr('y', (d) => (d.y0 + d.y1)/2)
                        .attr('stroke', config.textColor)
                        .attr('text-anchor', 'middle')
                        .attr('dy', 6)
                        .text((d) => d.id);
    }

    /* ----------------------------渲染图标题------------------------  */
    chart.renderTitle = function(){
        chart.svg().append('text')
                .classed('title', true)
                .attr('x', chart.width()/2)
                .attr('y', 0)
                .attr('dy', '2em')
                .text(config.title)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);

    }

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){

        // 悬停在节点上
        d3.selectAll('.node')
            .on('mouseover', function(d){
                d3.selectAll('.node, path')
                    .attr('fill-opacity', '0.1')
                    .attr('stroke-opacity', '0.1');

                d3.selectAll('[linkNodes*=' + d.id + ']')
                    .attr('fill-opacity', '1')
                    .attr('stroke-opacity', '0.4');



            })
            .on('mouseleave', function(){
                d3.selectAll('.node, path')
                    .attr('fill-opacity', '1')
                    .attr('stroke-opacity', '0.4');
            })

        // 悬停在连线上
        d3.selectAll('path')
            .on('mouseover', function(){
                d3.selectAll('.node, path')
                    .attr('fill-opacity', '0.1')
                    .attr('stroke-opacity', '0.1');

                const e = d3.event;
                const hoverNodes = d3.select(e.target)
                                        .attr('stroke-opacity', '0.4')
                                        .attr('linkNodes').split('-');

                hoverNodes.forEach((id) => {
                    d3.selectAll('[index=' + id + ']')
                    .attr('fill-opacity', '1')
                });
            })
            .on('mouseleave', function(){
                d3.selectAll('.node, path')
                    .attr('fill-opacity', '1')
                    .attr('stroke-opacity', '0.4');
            })
    }

    chart.render = function(){

        chart.renderTitle();

        chart.renderNodes();

        chart.renderLines();

        chart.renderTexts();

        chart.addMouseOn();
    }

    chart.renderChart();


});














