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
        alert('Erro ao buscar dados de fornecedores. Verifique o console para mais detalhes.');
      }
    };

    const fetchProfitRevenueRatio = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/profit-revenue-ratio');
        setProfitRevenueData(response.data);
        drawProfitRevenueChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de relação lucro/faturamento:', error);
        alert('Erro ao buscar dados de relação lucro/faturamento. Verifique o console para mais detalhes.');
      }
    };

    const fetchCategoryProportions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/category-proportions');
        setCategoryProportionsData(response.data);
        drawCategoryProportionsChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de proporção por categoria:', error);
        alert('Erro ao buscar dados de proporção por categoria. Verifique o console para mais detalhes.');
      }
    };

    const fetchTopProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/top-products');
        setTopProductsData(response.data);
        drawTopProductsChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de produtos mais lucrativos:', error);
        alert('Erro ao buscar dados de produtos mais lucrativos. Verifique o console para mais detalhes.');
      }
    };

    const fetchCategoryDistribution = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/category-distribution');
        setCategoryDistributionData(response.data);
        drawCategoryDistributionChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de distribuição por categoria:', error);
        alert('Erro ao buscar dados de distribuição por categoria. Verifique o console para mais detalhes.');
      }
    };

    const fetchProfitMargin = async () => {
      try {
        const response = await axios.get('http://localhost:5000/financial/profit-margin');
        setProfitMarginData(response.data);
        drawProfitMarginChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de margem de lucro:', error);
        alert('Erro ao buscar dados de margem de lucro. Verifique o console para mais detalhes.');
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
    const margin = { top: 40, right: 30, bottom: 80, left: 70 };

    const x = d3.scaleBand()
      .domain(data.map(d => d.nome_fornecedor))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total_faturamento)]).nice()
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

    data.forEach((d) => {
      const barWidth = x.bandwidth();
      const barHeight = y(0) - y(d.total_faturamento);
      const radius = 10;

      svg.append('rect')
        .attr('x', x(d.nome_fornecedor))
        .attr('y', y(d.total_faturamento) + 10)
        .attr('height', Math.min(barHeight, radius))
        .attr('width', barWidth)
        .attr('rx', radius)
        .attr('fill', '#FF1A66');

      svg.append('rect')
        .attr('x', x(d.nome_fornecedor))
        .attr('y', y(d.total_faturamento) + Math.min(barHeight, radius))
        .attr('height', barHeight - Math.min(barHeight, radius))
        .attr('width', barWidth)
        .attr('fill', 'url(#barGradient)');
    });

    svg.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.nome_fornecedor) + x.bandwidth() / 2)
      .attr('y', d => y(d.total_faturamento) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .text(d => d3.format(',.0f')(d.total_faturamento));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('y', 15)
      .attr('x', 0)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

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
    const margin = { top: 30, right: 20, bottom: 60, left: 60 };

    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.categoria_produto))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relacao_lucro_faturamento)]).nice()
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

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.categoria_produto))
      .attr('y', d => y(d.relacao_lucro_faturamento))
      .attr('height', d => y(0) - y(d.relacao_lucro_faturamento))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');

    svg.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.categoria_produto) + x.bandwidth() / 2)
      .attr('y', d => y(d.relacao_lucro_faturamento) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .text(d => d3.format('.2f')(d.relacao_lucro_faturamento));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.2f')));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Categoria de Produto');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 4)
      .attr('x', -height / 2.5)
      .text('Lucro/Faturamento');
  };

  const drawCategoryProportionsChart = (data) => {
    const svg = d3.select(categoryProportionsChartRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const margin = { top: 30, right: 20, bottom: 60, left: 60 };

    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.categories)
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.counts)]).nice()
      .range([height - margin.bottom, margin.top]);

    const yAxisTicks = Math.ceil(d3.max(data.counts) / 50) * 50;
    y.domain([0, yAxisTicks]);

    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ff7f0e');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#d45b00');

    svg.selectAll('.bar')
      .data(data.counts)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.categories[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');

    svg.selectAll('.label')
      .data(data.counts)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (_, i) => x(data.categories[i]) + x.bandwidth() / 2)
      .attr('y', d => y(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .text(d => d3.format('.2f')(d));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(yAxisTicks / 50).tickFormat(d3.format('.0f')));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Categoria');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 4)
      .attr('x', -height / 2.5)
      .text('Proporção');
  };

  const drawTopProductsChart = (data) => {
    const svg = d3.select(topProductsChartRef.current);
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const margin = { top: 30, right: 20, bottom: 60, left: 60 };

    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.produtos)
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.lucros)]).nice()
      .range([height - margin.bottom, margin.top]);

    const maxY = Math.ceil(d3.max(data.lucros) / 50) * 50;
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
      .attr('stop-color', '#2ca02c');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#006400');

    svg.selectAll('.bar')
      .data(data.lucros)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.produtos[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');

    svg.selectAll('.label')
      .data(data.lucros)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (_, i) => x(data.produtos[i]) + x.bandwidth() / 2)
      .attr('y', d => y(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .text(d => d3.format('.2f')(d));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(maxY / 200).tickFormat(d3.format('.0f')));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 4)
      .attr('x', -height / 2.5)
      .text('Lucro');
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
      .attr('stop-color', '#d62728');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#a2321f');

    svg.selectAll('.bar')
      .data(data.quantidades)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');

    svg.selectAll('.label')
      .data(data.quantidades)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (_, i) => x(data.categorias[i]) + x.bandwidth() / 2)
      .attr('y', d => y(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .text(d => d3.format('.2f')(d));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(maxY / 100).tickFormat(d3.format('.0f')));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Categoria');

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

    const x = d3.scaleBand()
      .domain(data.categorias)
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.margens)]).nice()
      .range([height - margin.bottom, margin.top]);

    const maxY = Math.ceil(d3.max(data.margens) / 50) * 50;
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
      .attr('stop-color', '#9467bd');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#7b5c91');

    svg.selectAll('.bar')
      .data(data.margens)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');

    svg.selectAll('.label')
      .data(data.margens)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (_, i) => x(data.categorias[i]) + x.bandwidth() / 2)
      .attr('y', d => y(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .text(d => d3.format('.2f')(d));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(maxY / 10).tickFormat(d3.format('.0f')));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Categoria');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 4)
      .attr('x', -height / 2.5)
      .text('Margem de Lucro');
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
