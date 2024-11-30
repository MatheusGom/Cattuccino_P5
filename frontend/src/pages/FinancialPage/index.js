import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import axios from 'axios';
import styles from './FinancialPage.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import FinancialSummary from '../../components/FinancialSummary';

const FinancialPage = () => {
  const { userType } = useParams();
  const [activeButton, setActiveButton] = useState('financial');

  useEffect(() => {
    setActiveButton('financial');
  }, []);

  const [topSuppliersData, setTopSuppliersData] = useState(null);
  const [profitRevenueData, setProfitRevenueData] = useState(null);
  const [categoryProportionsData, setCategoryProportionsData] = useState(null);
  const [topProductsData, setTopProductsData] = useState(null);
  const [categoryDistributionData, setCategoryDistributionData] = useState(null);
  const [profitMarginData, setProfitMarginData] = useState(null);

  const topSuppliersChartRef = useRef();
  const profitRevenueChartRef = useRef();
  const categoryProportionsChartRef = useRef();
  const topProductsChartRef = useRef();
  const categoryDistributionChartRef = useRef();
  const profitMarginChartRef = useRef();

  useEffect(() => {
    
    const fetchTopSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/top-suppliers');
        setTopSuppliersData(response.data);
        drawTopSuppliersChart(response.data, topSuppliersChartRef.current);
      } catch (error) {
        console.error('Erro ao buscar dados de fornecedores:', error);
      }
    };

    const fetchProfitRevenueRatio = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/profit-revenue-ratio');
        setProfitRevenueData(response.data);
        drawProfitRevenueChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de relação lucro/faturamento:', error);
      }
    };

    const fetchCategoryProportions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/category-proportions');
        setCategoryProportionsData(response.data);
        drawCategoryProportionsChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de proporção por categoria:', error);
      }
    };

    const fetchTopProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/top-products');
        setTopProductsData(response.data);
        drawTopProductsChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de produtos mais lucrativos:', error);
      }
    };

    const fetchCategoryDistribution = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/category-distribution');
        setCategoryDistributionData(response.data);
        drawCategoryDistributionChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de distribuição por categoria:', error);
      }
    };

    const fetchProfitMargin = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/profit-margin');
        setProfitMarginData(response.data);
        drawProfitMarginChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de margem de lucro:', error);
      }
    };

    fetchTopSuppliers();
    fetchProfitRevenueRatio();
    fetchCategoryProportions();
    fetchTopProducts();
    fetchCategoryDistribution();
    fetchProfitMargin();
  }, []);

  const drawTopSuppliersChart = (data, svgElement) => {
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const margin = { top: 40, right: 0, bottom: 80, left: 70 };
  
    const topSuppliers = data
      .sort((a, b) => b.total_faturamento - a.total_faturamento)
      .slice(0, 3);
  
    const x = d3.scaleBand()
      .domain(topSuppliers.map(d => d.nome_fornecedor))
      .range([margin.left, width - margin.right])
      .padding(0.6);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(topSuppliers, d => d.total_faturamento)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
  
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FF1A66');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#99103D');
  
    topSuppliers.forEach((d) => {
      const barWidth = x.bandwidth();
      const barHeight = y(0) - y(d.total_faturamento);
      const radius = 20;
  
      svg.append('rect')
        .attr('x', x(d.nome_fornecedor))
        .attr('y', y(d.total_faturamento) + 8.5)
        .attr('height', Math.min(barHeight, radius) - 8)
        .attr('width', barWidth)
        .attr('rx', radius)
        .attr('fill', '#FF1A66');
  
      svg.append('rect')
        .attr('x', x(d.nome_fornecedor))
        .attr('y', y(d.total_faturamento) + Math.min(barHeight, radius) - 5)
        .attr('height', barHeight - Math.min(barHeight, radius) + 5)
        .attr('width', barWidth)
        .attr('fill', 'url(#barGradient)');
    });
  
    svg.selectAll('.label')
      .data(topSuppliers)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.nome_fornecedor) + x.bandwidth() / 2)
      .attr('y', d => y(d.total_faturamento) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text(d => d3.format(',.0f')(d.total_faturamento));
  
    const wrap = (text, width) => {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/[\s]+/);
        const lineHeight = 1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        
        let tspan = text.text(null).append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");
        
        let lineNumber = 0;
        let line = [];
        let word;
  
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    };
  
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  
    xAxis.selectAll('.tick text')
      .attr('transform', 'rotate(0)')
      .attr('dy', '1')
      .call(wrap, x.bandwidth())
      .style('font-size', '12px')
      .style('text-anchor', 'middle');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(',.0f')));
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Fornecedor');
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 6)
      .attr('x', -height / 2.25)
      .text('Faturamento (R$)');
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold');
  };  

  const drawProfitRevenueChart = (data) => {
    const svg = d3.select(profitRevenueChartRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const margin = { top: 30, right: 20, bottom: 80, left: 60 };
  
    svg.selectAll('*').remove();
  
    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.relacao_lucro_faturamento), d3.max(data, d => d.relacao_lucro_faturamento)])
      .nice()
      .range([height - margin.bottom, margin.top]);
  
    const x = d3.scaleBand()
      .domain(data.map(d => d.categoria_produto))
      .range([margin.left, width - margin.right])
      .padding(0.7);
  
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
  
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FF1A66');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#99103D');
  
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.categoria_produto))
      .attr('y', d => d.relacao_lucro_faturamento < 0 ? y(0) : y(d.relacao_lucro_faturamento))
      .attr('height', d => Math.abs(y(0) - y(d.relacao_lucro_faturamento)))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');
  
    svg.selectAll('.roundedTop')
      .data(data)
      .enter().append('rect')
      .attr('class', 'roundedTop')
      .attr('x', d => x(d.categoria_produto))
      .attr('y', d => d.relacao_lucro_faturamento < 0 ? y(d.relacao_lucro_faturamento) - 2.5 : y(d.relacao_lucro_faturamento) - 2.5)
      .attr('height', 5)
      .attr('width', x.bandwidth())
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => d.relacao_lucro_faturamento < 0 ? '#99103D' : '#FF1A66');
  
    svg.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.categoria_produto) + x.bandwidth() / 2)
      .attr('y', d => {
        const baseY = d.relacao_lucro_faturamento < 0 ? y(d.relacao_lucro_faturamento) : y(d.relacao_lucro_faturamento);
        return d.relacao_lucro_faturamento < 0 ? baseY + 15 : baseY - 10;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text(d => d3.format('.2f')(d.relacao_lucro_faturamento));
  
      svg.append('g')
      .attr('transform', `translate(0,${height - (margin.bottom * 1.561)})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', (d, i) => {
        const dataPoint = data.find(item => item.categoria_produto === d);
        const dy = dataPoint && dataPoint.relacao_lucro_faturamento < 0 ? -35 : 15;
        const dx = d === "CONDIMENTO" ? 20 : 0;
        return `translate(${dx},${dy})`;
      })
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .attr('dx', '15');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.2f')));
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 5)
      .attr('x', -height / 2.5)
      .text('Lucro/Faturamento (%)');
  };
  
  const drawCategoryProportionsChart = (data) => {
    const svg = d3.select(categoryProportionsChartRef.current);
    const width = svg.node().clientWidth || 400;
    const height = svg.node().clientHeight || 400;
    const radius = Math.min(width, height) / 2 - 20;
  
    svg.selectAll('*').remove();
  
    if (!data || !data.categories || !data.counts || data.categories.length === 0 || data.counts.length === 0) {
      return;
    }
  
    const pie = d3.pie().value((d) => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
  
    const colors = d3.scaleOrdinal()
      .domain(data.categories)
      .range(['#500124', '#A8094F', '#ED1164', '#FF6997', '#FFCADA', '#FFE2EA']);
  
    const formattedData = data.categories.map((category, index) => ({
      category,
      count: data.counts[index],
    }));
  
    const group = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
    group.selectAll('path')
      .data(pie(formattedData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colors(d.data.category))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');
  
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 110},${50})`);
  
    legend.selectAll('rect')
      .data(formattedData)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (_, i) => i * 20)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colors(d.category));
  
    legend.selectAll('text')
      .data(formattedData)
      .enter()
      .append('text')
      .attr('x', 20)
      .attr('y', (_, i) => i * 20 + 12)
      .attr('font-size', '10px')
      .attr('text-anchor', 'start')
      .text((d) => `${d.category}: ${d.count}`);
  };  
  
  const drawTopProductsChart = (data) => {
    const svg = d3.select(topProductsChartRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const margin = { top: 30, right: 40, bottom: 60, left: 120 };
  
    svg.selectAll('*').remove();
  
    const x = d3.scaleLinear()
      .domain([0, d3.max(data.lucros)]).nice()
      .range([margin.left, width - margin.right]);
  
    const y = d3.scaleBand()
      .domain(data.produtos)
      .range([margin.top, height - margin.bottom])
      .padding(0.5);
  
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
  
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FF1A66');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#99103D');
  
    svg.selectAll('.bar')
      .data(data.lucros)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('y', (_, i) => y(data.produtos[i]))
      .attr('x', x(0))
      .attr('width', d => x(d) - x(0))
      .attr('height', y.bandwidth())
      .attr('fill', 'url(#barGradient)');
  
    svg.selectAll('.label')
      .data(data.lucros)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d) + 5)
      .attr('y', (_, i) => y(data.produtos[i]) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text(d => d3.format('.2f')(d));
  
    const wrap = (text, width) => {
      text.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        const y = text.attr('y');
        const dy = parseFloat(text.attr('dy')) || 0;
        let line = [];
        let lineNumber = 0;
  
        let tspan = text.text(null).append('tspan')
          .attr('x', -10)
          .attr('y', y)
          .attr('dy', `${dy}em`);
  
        let word;
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan')
              .attr('x', -10)
              .attr('y', y)
              .attr('dy', `${++lineNumber * 1.1}em`)
              .text(word);
          }
        }
      });
    };
  
    const yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll('.tick text')
      .call(wrap, margin.left - 20)
      .style('font-size', '12px');
  
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.0f')))
      .selectAll('text')
      .style('font-size', '10px');
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Lucro (R$)');
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 4)
      .attr('x', -height / 2)
      .text('Produtos');
  };  
  
  const drawCategoryDistributionChart = (data) => {
    const svg = d3.select(categoryDistributionChartRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const margin = { top: 30, right: 20, bottom: 60, left: 60 };
  
    svg.selectAll('*').remove();
  
    const x = d3.scaleBand()
      .domain(data.categorias)
      .range([margin.left, width - margin.right])
      .padding(0.4);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data.quantidades)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    const maxY = Math.ceil(d3.max(data.quantidades) / 100) * 100;
    y.domain([0, maxY]);
  
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
  
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FF1A66');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#99103D');
  
    svg.selectAll('.bar-body')
      .data(data.quantidades)
      .enter().append('rect')
      .attr('class', 'bar-body')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');
  
    svg.selectAll('.bar-top')
      .data(data.quantidades)
      .enter().append('rect')
      .attr('class', 'bar-top')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => y(d) - 3.5)
      .attr('height', 7.5)
      .attr('width', x.bandwidth())
      .attr('rx', 50)
      .attr('ry', 10)
      .attr('fill', '#FF1A66');
  
    svg.selectAll('.label')
      .data(data.quantidades)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (_, i) => x(data.categorias[i]) + x.bandwidth() / 2)
      .attr('y', d => y(d) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text(d => d3.format('.2f')(d));
  
      svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', (d) => {
        const dx = d === "CONDIMENTO" ? 30 : 15;
        const dy = 5;
        return `rotate(0) translate(${dx},${dy})`;
      })
      .style('text-anchor', 'end')
      .style('font-size', '10px');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(maxY / 100).tickFormat(d3.format('.0f')));
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 4)
      .attr('x', -height / 2.5)
      .text('Quantidade');
  };
  
  const drawProfitMarginChart = (data) => {
    const svg = d3.select(profitMarginChartRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const margin = { top: 30, right: 20, bottom: 60, left: 60 };
  
    svg.selectAll('*').remove();
  
    const y = d3.scaleLinear()
      .domain([d3.min(data.margens), d3.max(data.margens)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    const x = d3.scaleBand()
      .domain(data.categorias)
      .range([margin.left, width - margin.right])
      .padding(0.4);
  
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
  
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FF1A66');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#99103D');
  
    svg.selectAll('.bar')
      .data(data.margens)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => d < 0 ? y(0) : y(d))
      .attr('height', d => Math.abs(y(0) - y(d)))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');
  
    svg.selectAll('.roundedTop')
      .data(data.margens)
      .enter().append('rect')
      .attr('class', 'roundedTop')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => d < 0 ? y(d) - 3.5 : y(d) - 3.5)
      .attr('height', 7.5)
      .attr('width', x.bandwidth())
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => d < 0 ? '#99103D' : '#FF1A66');
  
    svg.selectAll('.label')
      .data(data.margens)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (_, i) => x(data.categorias[i]) + x.bandwidth() / 2)
      .attr('y', d => d < 0 ? y(d) + 18 : y(d) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text(d => d3.format('.2f')(d));
  
      svg.append('g')
      .attr('transform', `translate(0,${height - (margin.bottom * 1.935)})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', (d, i) => {
        const margin = data.margens[i] < 0 ? -45 : 15;
        const dx = d === "CONDIMENTO" ? 30 : 15;
        return `rotate(0) translate(${dx},${margin})`;
      })
      .style('text-anchor', 'end')
      .style('font-size', '10px');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.2f')));
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 5.25)
      .attr('x', -height / 2.3)
      .text('Margem de Lucro (%)');
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar activeButton={activeButton} setActiveButton={setActiveButton} userType={userType} />
      </div>
      <div className={styles['main-content']}>
        <div className={styles.header}>
          <Header activeButton={activeButton} />
        </div>
        {FinancialSummary ? (
          <div className={styles.summary}>
            <FinancialSummary data={FinancialSummary} />
          </div>
        ) : (
          <p>Carregando resumo financeiro...</p>
        )}
        <div className={styles['content-grid']}>
          <div className={styles.card}>
            <h2>Top Fornecedores</h2>
            <svg ref={topSuppliersChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Relação Lucro/Faturamento</h2>
            <svg ref={profitRevenueChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Proporções por Categoria</h2>
            <svg ref={categoryProportionsChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Top Produtos</h2>
            <svg ref={topProductsChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Distribuição por Categoria</h2>
            <svg ref={categoryDistributionChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Margem de Lucro por Categoria</h2>
            <svg ref={profitMarginChartRef}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPage;
