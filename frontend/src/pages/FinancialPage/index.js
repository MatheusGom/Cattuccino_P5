import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import axios from 'axios';
import styles from './FinancialPage.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

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
        drawTopSuppliersChart(response.data);
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

  const drawTopSuppliersChart = (data) => {
    const svg = d3.select(topSuppliersChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.nome_fornecedor))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total_faturamento)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.nome_fornecedor))
      .attr('y', d => y(d.total_faturamento))
      .attr('height', d => y(0) - y(d.total_faturamento))
      .attr('width', x.bandwidth())
      .attr('fill', '#69b3a2');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  const drawProfitRevenueChart = (data) => {
    const svg = d3.select(profitRevenueChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(data.map(d => d.categoria_produto))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relacao_lucro_faturamento)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.categoria_produto))
      .attr('y', d => y(d.relacao_lucro_faturamento))
      .attr('height', d => y(0) - y(d.relacao_lucro_faturamento))
      .attr('width', x.bandwidth())
      .attr('fill', '#4682b4');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  const drawCategoryProportionsChart = (data) => {
    const svg = d3.select(categoryProportionsChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  
    svg.selectAll('*').remove();
  
    const x = d3.scaleBand()
      .domain(data.categories)
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data.counts)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    svg.selectAll('.bar')
      .data(data.counts)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.categories[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', '#ff7f0e');
  
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };
  
  const drawTopProductsChart = (data) => {
    const svg = d3.select(topProductsChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  
    svg.selectAll('*').remove();
  
    const x = d3.scaleBand()
      .domain(data.produtos)
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data.lucros)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    svg.selectAll('.bar')
      .data(data.lucros)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.produtos[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', '#2ca02c');
  
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  const drawCategoryDistributionChart = (data) => {
    const svg = d3.select(categoryDistributionChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  
    svg.selectAll('*').remove();
  
    const x = d3.scaleBand()
      .domain(data.categorias)
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data.quantidades)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    svg.selectAll('.bar')
      .data(data.quantidades)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', '#d62728');
  
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  const drawProfitMarginChart = (data) => {
    const svg = d3.select(profitMarginChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  
    svg.selectAll('*').remove();
  
    const x = d3.scaleBand()
      .domain(data.categorias)
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data.margens)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    svg.selectAll('.bar')
      .data(data.margens)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(data.categorias[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .attr('fill', '#9467bd');
  
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
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
        {/* ======================================*/ }
        {/* Resumo Financeiro */}
        {financialSummaryData ? (
          <div className={styles.summary}>
            <FinancialSummary data={financialSummaryData} />
          </div>
        ) : (
          <p>Carregando resumo financeiro...</p>
        )}
        {/* ======================================*/ }

        {/* Gráficos */}
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
