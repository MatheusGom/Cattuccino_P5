import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as d3 from 'd3';
import axios from 'axios';
import styles from './Home.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MarketingSummary from '../../components/MarketingSummary';
import FinancialSummary from '../../components/FinancialSummary';

function Home() {
    const { userType } = useParams();
    const [activeButton, setActiveButton] = useState('home');

    const [genderData, setGenderData] = useState(null);
    const genderChartRef = useRef();

    const [peakHoursData, setPeakHoursData] = useState(null);
    const peakHoursChartRef = useRef();

    const [profitRevenueData, setProfitRevenueData] = useState(null);
    const profitRevenueChartRef = useRef();

    const [categoryDistributionData, setCategoryDistributionData] = useState(null);
    const categoryDistributionChartRef = useRef();

    useEffect(() => {
        const fetchGenderData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/marketing/gender-analysis');
                setGenderData(response.data);

                if (response.data && response.data.generos && response.data.ocorrencias) {
                    drawGenderChart(response.data, genderChartRef.current);
                }
            } catch (error) {
                console.error('Erro ao buscar dados de análise de gênero:', error);
            }
        };

        const fetchPeakHoursData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/marketing/peak-hours');
                setPeakHoursData(response.data);
                if (response.data.dias && response.data.horarios) { drawPeakHoursChart(response.data); }
            } catch (error) {
                console.error('Erro ao buscar dados de horários de pico:', error);
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

        const fetchCategoryDistribution = async () => {
            try {
                const response = await axios.get('http://localhost:5000/financial/category-distribution');
                setCategoryDistributionData(response.data);
                drawCategoryDistributionChart(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados de distribuição por categoria:', error);
            }
        };

        fetchGenderData();
        fetchPeakHoursData();
        fetchProfitRevenueRatio();
        fetchCategoryDistribution();
    }, []);

    const drawGenderChart = (data, svgElement) => {
        const svg = d3.select(svgElement);
        svg.selectAll('*').remove();

        const width = svgElement.clientWidth || 400;
        const height = svgElement.clientHeight || 400;
        const radius = Math.min(width, height) / 2 - 20;

        if (!data || data.length === 0) return;

        const pie = d3.pie().value(d => d.ocorrencias);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const colors = ['#ED1164', '#FF9FBA'];

        const formattedData = data.generos.map((genero, index) => ({
            genero: genero,
            ocorrencias: data.ocorrencias[index]
        }));

        const group = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        group.selectAll('path')
            .data(pie(formattedData))
            .enter().append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => colors[i % colors.length]);

        group.selectAll('text')
            .data(pie(formattedData))
            .enter().append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px')
            .attr('font-weight', '900')
            .text(d => `${d.data.genero}: ${d.data.ocorrencias}`);
    };

    const drawPeakHoursChart = (data) => {
        const svg = d3.select(peakHoursChartRef.current);
        svg.selectAll('*').remove();

        const svgElement = svg.node();
        const width = svgElement.clientWidth;
        const height = svgElement.clientHeight;
        const margin = { top: 40, right: 30, bottom: 50, left: 60 };

        const orderedDays = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"];
        const formattedData = orderedDays.map(day => ({
            dia: day,
            horario_pico: data.dias.includes(day)
                ? data.horarios[data.dias.indexOf(day)]
                : null
        }));

        const x = d3.scaleBand()
            .domain(orderedDays)
            .range([margin.left, width - margin.right])
            .padding(0.3);

        const y = d3.scaleLinear()
            .domain([0, 24]).nice()
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
            .data(formattedData)
            .enter().append('g')
            .attr('class', 'bar')
            .each(function (d) {
                const barGroup = d3.select(this);

                const baseHeight = y(0) - y(parseInt(d.horario_pico?.split(':')[0]) || 0);
                const barWidth = x.bandwidth();
                const radius = 20;

                barGroup.append('rect')
                    .attr('x', x(d.dia))
                    .attr('y', y(parseInt(d.horario_pico?.split(':')[0]) || 0))
                    .attr('width', barWidth)
                    .attr('height', Math.min(baseHeight, radius))
                    .attr('rx', radius)
                    .attr('fill', '#FF1A66');

                barGroup.append('rect')
                    .attr('x', x(d.dia))
                    .attr('y', y(parseInt(d.horario_pico?.split(':')[0]) || 0) + Math.min(baseHeight, radius) + -10)
                    .attr('height', baseHeight - Math.min(baseHeight, radius) + 10)
                    .attr('width', barWidth)
                    .attr('fill', 'url(#barGradient)');
            });

        svg.selectAll('.label')
            .data(formattedData)
            .enter().append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.dia) + x.bandwidth() / 2)
            .attr('y', d => y(parseInt(d.horario_pico?.split(':')[0]) || 0) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .text(d => d.horario_pico || '');

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y)
                .ticks(12)
                .tickFormat(d => `${d}:00`));

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', height - 10)
            .text('Dia da Semana');

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('y', margin.left / 4)
            .attr('x', -height / 2.25)
            .text('Horario Pico');
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

    return (
        <>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <Sidebar userType={userType} activeButton={activeButton} setActiveButton={setActiveButton} />
                </div>
                <div className={styles['main-content']}>
                    <div className={styles.header}>
                        <Header activeButton={activeButton} />
                    </div>
                    <div className={styles['component-container']}>
                        {MarketingSummary ? (
                            <div className={styles.summary}>
                                <MarketingSummary data={MarketingSummary} />
                            </div>
                        ) : (
                            <p>Carregando resumo de marketing...</p>
                        )}
                        {FinancialSummary ? (
                            <div className={styles.summary}>
                                <FinancialSummary data={FinancialSummary} />
                            </div>
                        ) : (
                            <p>Carregando resumo financeiro...</p>
                        )}
                    </div>
                    <div className={styles['content-grid']}>
                        <div className={styles.card}>
                            <h2>Análise de Gênero</h2>
                            <svg ref={genderChartRef} width="400" height="400"></svg>
                        </div>
                        <div className={styles.card}>
                            <h2>Horários de Pico</h2>
                            <svg ref={peakHoursChartRef} width="400" height="400"></svg>
                        </div>
                        <div className={styles.card}>
                            <h2>Relação Lucro/Faturamento</h2>
                            <svg ref={profitRevenueChartRef} width="400" height="400"></svg>
                        </div>
                        <div className={styles.card}>
                            <h2>Distribuição por Categoria</h2>
                            <svg ref={categoryDistributionChartRef} width="400" height="400"></svg>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
