import Chart from "./chart.js";
let tmp = [
    {"id": "California"},{"id": "Maine"},{"id": "Arizona"},
    {"id": "New York"},{"id": "North Dakota"},{"id": "Texas"},
    {"id": "Montana"},{"id": "Minnesota"},{"id": "Vermont"},
    {"id": "Washington"},{"id": "Idaho"},{"id": "Michigan"},
    {"id": "New Mexico"},{"id": "Alaska"},{"id": "Ohio"},
    {"id": "Calexico East"},{"id": "Van Buren"},{"id": "Otay Mesa"},
    {"id": "Nogales"},{"id": "Trout River"},{"id": "Madawaska"},
    {"id": "Lancaster"},{"id": "Progreso"},{"id": "Portal"},
    {"id": "Champlain-Rouses Point"},{"id": "Opheim"},{"id": "Neche"},
    {"id": "Derby Line"},{"id": "Sarles"},{"id": "Wildhorse"},
    {"id": "Lynden"},{"id": "Vanceboro"},{"id": "San Ysidro"},
    {"id": "Scobey"},{"id": "Beecher Falls"},{"id": "Calais"},
    {"id": "Massena"},{"id": "Oroville"},{"id": "Hansboro"},
    {"id": "Ferry"},{"id": "Tecate"},{"id": "Eastport"},
    {"id":"Walhalla"},
    {"id":'Roma'}, {"id":'Naco'}, {"id":'Boquillas'}, {"id":'Raymond'}, {"id":'Porthill'}, {"id":'Norton'},
    {"id":'Sault Sainte Marie'}, {"id":'Antler'}, {"id":'Rio Grande City'}, {"id":'Del Rio'},
    {"id":'Sasabe'}, {"id":'Highgate Springs-Alburg'}, {"id":'Del Bonita'}, {"id":'Houlton'},
    {"id":'Metaline Falls'}, {"id":'Fort Fairfield'}, {"id":'Noonan'}, {"id":'Westhope'}, {"id":'Blaine'},
    {"id":'Douglas'}, {"id":'Port Huron'}, {"id":'Bridgewater'}, {"id":'Santa Teresa'},
    {"id":'Lukeville'}, {"id":'Roseau'}, {"id":'Skagway'}, {"id":'Fortuna'}, {"id":'Frontier'},
    {"id":'Baudette'}, {"id":'Fort Kent'}, {"id":'Grand Portage'}, {"id":'Buffalo-Niagara Falls'},
    {"id":'Calexico'}, {"id":'Pinecreek'}, {"id":'Northgate'}, {"id":'Sherwood'}, {"id":'Laurier'},
    {"id":'Detroit'}, {"id":'Jackman'}, {"id":'Ambrose'}, {"id":'Turner'}, {"id":'Dunseith'}, {"id":'Boundary'},
    {"id":'Sumas'}, {"id":'Alexandria Bay'}, {"id":'Eagle Pass'}, {"id":'Carbury'}, {"id":'Sweetgrass'},
    {"id":'Piegan'}, {"id":'Tornillo-Fabens'}, {"id":'El Paso'}, {"id":'Port Angeles'}, {"id":'San Luis'},
    {"id":'Danville'}, {"id":'Nighthawk'}, {"id":'Warroad'}, {"id":'Whitlash'}, {"id":'Maida'},
    {"id":'Limestone'}, {"id":'Andrade'}, {"id":'Hidalgo'}, {"id":'Richford'}, {"id":'Point Roberts'},
    {"id":'International Falls-Ranier'}, {"id":'St. John'}, {"id":'Columbus'},
    {"id":'Brownsville'}, {"id":'Presidio'}, {"id":'Ogdensburg'}, {"id":'Anacortes'}, {"id":'Morgan'},
    {"id":'Willow Creek'}, {"id":'Roosville'}, {"id":'Laredo'}, {"id":'Hannah'}, {"id":'Ketchikan'},
    {"id":'Alcan'}, {"id":'Dalton Cache'}, {"id":'Cross Border Xpress'}, {"id":'Friday Harbor'},
    {"id":'Algonac'}, {"id":'Portland'}, {"id":'Cape Vincent'}, {"id":'Toledo-Sandusky'},
    {"id":'Whitetail'}, {"id":'Noyes'}, {"id":'Bar Harbor'}]
    for(let i=0;i<tmp.length;i++){
        let a = tmp[i]['id'].split(" ")
        if(a.length > 1){
            tmp[i]['id'] = a[0] + '_' + a[1]
        }
    }
let relation = []
d3.csv('./train2019.csv', function(d){
    let a = d['port'].split(" ")
    if(a.length > 1)
        d['port'] = a[0] + '_' + a[1]

    a = d['state'].split(" ")
    if(a.length > 1)
        d['state'] = a[0] + '_' + a[1] 

    let re = {"source": d['port'], "target": d['state'], "value": d['value']}
    relation.push(re)
    console.log(re)
});
d3.json('./data.json').then(function(data){

    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        margins: {top: 80, left: 50, bottom: 50, right: 50},
        textColor: 'black',
        title: '基础桑基图'
    }

    chart.margins(config.margins);

    /* ----------------------------数据转换------------------------  */
    const sankey = d3.sankey()
                        .nodeWidth(50)
                        .nodePadding(30)
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














