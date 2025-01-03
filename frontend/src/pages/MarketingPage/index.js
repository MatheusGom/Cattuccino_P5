import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import axios from 'axios';
import styles from './MarketingPage.module.css'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MarketingSummary from '../../components/MarketingSummary';

const MarketingPage = () => {
  const { userType } = useParams();
  const [activeButton, setActiveButton] = useState('marketing');

  useEffect(() => {
    setActiveButton('marketing');
  }, []);

  const [marketingData, setMarketingData] = useState([]);
  const [distributionData, setDistributionData] = useState(null);
  const [genderData, setGenderData] = useState(null);
  const [peakHoursData, setPeakHoursData] = useState(null);
  const chartRef = useRef();
  const distributionChartRef = useRef();
  const genderChartRef = useRef();
  const peakHoursChartRef = useRef();
  const [reachData, setReachData] = useState(null);
  const reachChartRef = useRef();
  const [averageReachData, setAverageReachData] = useState(null);
  const averageReachChartRef = useRef();

  useEffect(() => {
    const fetchRevenueByDay = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/revenue-by-day');
        setMarketingData(response.data);
        if (response.data.length > 0) {
          drawRevenueChart(response.data, chartRef.current);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de marketing:', error);
      }
    };

    const fetchDistributionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/distributions');
        console.log('Dados de distribuição recebidos:', response.data);

        const data = Array.isArray(response.data) ? response.data : Object.keys(response.data).map(key => ({
          name: key,
          average: parseFloat(response.data[key].average),
          stddev: parseFloat(response.data[key].stddev),
        }));

        setDistributionData(data);

        if (data.length > 0 && distributionChartRef.current) {
          drawDistributionChart(data, distributionChartRef.current);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de distribuição:', error);
      }
    };

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

    const fetchReachByDay = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/reach-by-day');
        setReachData(response.data);
        if (response.data) drawReachChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de alcance diário:', error);
      }
    };

    const fetchAverageReachData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/average-reach');
        setAverageReachData(response.data);

        console.log('Dados de alcance médio:', response.data);

        if (response.data) {
          drawAverageReachChart(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de alcance médio por faixa etária:', error);
      }
    };

    fetchRevenueByDay();
    fetchDistributionData();
    fetchGenderData();
    fetchPeakHoursData();
    fetchReachByDay();
    fetchAverageReachData();
  }, []);

  const drawRevenueChart = (data, svgElement) => {
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const margin = { top: 40, right: 30, bottom: 60, left: 70 };

    const orderedDays = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
    const formattedData = orderedDays.map((day, index) => ({
      dia_semana: day,
      total_faturamento: data.find(d => d.dia_semana === ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"][index])?.total_faturamento || 0
    }));

    const x = d3.scaleBand()
      .domain(formattedData.map(d => d.dia_semana))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.total_faturamento)]).nice()
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

    formattedData.forEach((d, i) => {
      const barWidth = x.bandwidth();
      const barHeight = y(0) - y(d.total_faturamento);
      const radius = 20;

      svg.append('rect')
        .attr('x', x(d.dia_semana))
        .attr('y', y(d.total_faturamento) + 10)
        .attr('height', Math.min(barHeight, radius))
        .attr('width', barWidth)
        .attr('rx', radius)
        .attr('fill', '#FF1A66');

      svg.append('rect')
        .attr('x', x(d.dia_semana))
        .attr('y', y(d.total_faturamento) + Math.min(barHeight, radius))
        .attr('height', barHeight - Math.min(barHeight, radius))
        .attr('width', barWidth)
        .attr('fill', 'url(#barGradient)');
    });

    svg.selectAll('.label')
      .data(formattedData)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.dia_semana) + x.bandwidth() / 2)
      .attr('y', d => y(d.total_faturamento) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text(d => d3.format(',.0f')(d.total_faturamento));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('y', 15)
      .attr('x', 0)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(0)')
      .style('text-anchor', 'middle')
      .style('font-size', '12px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(',.0f')));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Dia da Semana');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 6)
      .attr('x', -height / 2.25)
      .text('Faturamento (R$)');
  };

  const drawDistributionChart = (data, svgElement) => {
  
    if (!svgElement) {
      console.error('Elemento SVG não encontrado!');
      return;
    }
  
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
  
    const width = svgElement.clientWidth || 600;
    const height = svgElement.clientHeight || 300;
  
    const margin = { top: 40, right: 30, bottom: 100, left: 70 };
    
    const wrap = (text, width) => {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/[\s_]+/);
        const lineHeight = 1.1;
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
  
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.average + d.stddev)])
      .nice()
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
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.average))
      .attr('height', d => y(0) - y(d.average))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)');
    
    svg.selectAll('.error-line')
      .data(data)
      .enter()
      .append('line')
      .attr('class', 'error-line')
      .attr('x1', d => x(d.name) + x.bandwidth() / 2)
      .attr('x2', d => x(d.name) + x.bandwidth() / 2)
      .attr('y1', d => y(d.average + d.stddev))
      .attr('y2', d => y(d.average - d.stddev))
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.name) + x.bandwidth() / 2)
      .attr('y', d => y(d.average) - 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'black')
      .text(d => d3.format('.2f')(d.average));
  
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  
    xAxis.selectAll('.tick text')
      .call(wrap, x.bandwidth())
      .style('font-size', '12px')
      .attr('transform', `translate(0,10)`);
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y)
          .ticks(5)
          .tickFormat(d3.format('.0f'))
      )
      .style('font-size', '12px');
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('font-size', '16px');
  };  

  const drawGenderChart = (data, svgElement) => {
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
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

  const drawReachChart = (data) => {
    const svg = d3.select(reachChartRef.current);
    svg.selectAll('*').remove();

    const svgElement = svg.node();
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const margin = { top: 20, right: 30, bottom: 80, left: 50 };

    const { dias, instagram, facebook, tiktok } = data;

    if (!dias || !instagram || !facebook || !tiktok) {
      console.error('Dados inválidos:', data);
      return;
    }

    const x = d3.scaleBand()
      .domain(dias)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max([...instagram, ...facebook, ...tiktok])]).nice()
      .range([height - margin.bottom, margin.top]);

    ['Instagram', 'Facebook', 'TikTok'].forEach((platform, i) => {
      const platformData = [instagram, facebook, tiktok][i];
      const color = ['#ED1164', '#FF9FBA', '#500124'][i];

      svg.selectAll(`.bar-${platform.toLowerCase()}`)
        .data(platformData)
        .enter().append('rect')
        .attr('class', `bar-${platform.toLowerCase()}`)
        .attr('x', (d, j) => x(dias[j]) + (i * x.bandwidth()) / 3)
        .attr('y', d => y(d))
        .attr('height', d => y(0) - y(d))
        .attr('width', x.bandwidth() / 3)
        .attr('fill', color);
    });

    const legendData = [
      { platform: 'Instagram', color: '#ED1164', logo: 'instagram_logo.svg' },
      { platform: 'Facebook', color: '#FF9FBA', logo: 'facebook_logo.svg' },
      { platform: 'TikTok', color: '#000', logo: 'tiktok_logo.svg' }
    ];

    const legend = svg.selectAll('.legend')
      .data(legendData)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${i * 120 + margin.left}, ${height - margin.bottom + 30})`);

    legend.append('image')
      .attr('x', 35)
      .attr('y', 10)
      .attr('width', 20)
      .attr('height', 20)
      .attr('xlink:href', d => `/images/${d.logo}`);

    legend.append('circle')
      .attr('r', 2.5)
      .attr('cx', 60)
      .attr('cy', 10)
      .attr('fill', d => d.color);

    legend.append('text')
      .attr('x', 70)
      .attr('y', 25)
      .attr('font-size', '12px')
      .attr('fill', '#000')
      .text(d => d.platform);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(0)')
      .style('text-anchor', 'middle');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(Math.ceil(d3.max([...instagram, ...facebook, ...tiktok]) / 10000)));
  };

  const drawAverageReachChart = (data) => {
    const svg = d3.select(averageReachChartRef.current);
    svg.selectAll('*').remove();
  
    const svgElement = svg.node();
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const margin = { top: 20, right: 0, bottom: 80, left: 60 };
  
    const colors = ['#ED1164', '#FF9FBA', '#500124'];
    const platforms = ['instagram', 'facebook', 'tiktok'];
  
    const ageGroups = ['13-20', '21-30', '31-40', '41-50', '51-60'];
  
    const groupedData = ageGroups.map(group => {
      const [minAge, maxAge] = group.split('-').map(Number);
      return {
        ageGroup: group,
        data: platforms.map(platform => {
          const platformData = data[platform].filter(d => {
            const [min, max] = d[`idade_${platform}`].split('-').map(Number);
            return (min >= minAge && min <= (maxAge || Infinity)) || 
                   (max >= minAge && max <= (maxAge || Infinity)) ||
                   (min <= minAge && max >= (maxAge || Infinity));
          });
          
          const reach = platformData.length > 0
            ? platformData.reduce((sum, d) => sum + d[`alcance_${platform}`], 0) / platformData.length
            : 0;
            
          return {
            platform,
            reach: reach
          };
        })
      };
    });
  
    const x0 = d3.scaleBand()
      .domain(ageGroups)
      .range([margin.left, width + margin.right])
      .paddingInner(0.25);
  
    const x1 = d3.scaleBand()
      .domain(platforms)
      .range([0, x0.bandwidth()])
      .padding(0);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(groupedData, g => d3.max(g.data, d => d.reach || 0)) * 1])
      .nice()
      .range([height - margin.bottom, margin.top]);
  
    groupedData.forEach(group => {
      const ageGroup = svg.append('g')
        .attr('transform', `translate(${x0(group.ageGroup)},0)`);
  
      group.data.forEach((d, i) => {
        ageGroup.append('rect')
          .attr('x', x1(d.platform) + 10)
          .attr('y', y(d.reach))
          .attr('width', x1.bandwidth())
          .attr('height', height - margin.bottom - y(d.reach))
          .attr('fill', colors[i]);
      });
    });
  
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '15')
      .attr('dy', '15')
      .attr('transform', 'rotate(0)');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 3)
      .attr('y', margin.left / 4)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '900')
      .text('Alcance Medio');
  
    const legendData = [
      { platform: 'Instagram', color: '#ED1164', logo: 'instagram_logo.svg' },
      { platform: 'Facebook', color: '#FF9FBA', logo: 'facebook_logo.svg' },
      { platform: 'TikTok', color: '#000', logo: 'tiktok_logo.svg' }
    ];
  
    const legend = svg.selectAll('.legend')
      .data(legendData)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${i * 120 + margin.left}, ${height - margin.bottom + 30})`);
  
    legend.append('image')
      .attr('x', 35)
      .attr('y', 10)
      .attr('width', 20)
      .attr('height', 20)
      .attr('xlink:href', d => `/images/${d.logo}`);
  
    legend.append('circle')
      .attr('r', 2.5)
      .attr('cx', 60)
      .attr('cy', 10)
      .attr('fill', d => d.color);
  
    legend.append('text')
      .attr('x', 70)
      .attr('y', 25)
      .attr('font-size', '12px')
      .attr('fill', '#000')
      .text(d => d.platform);
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
        {MarketingSummary ? (
          <div className={styles.summary}>
            <MarketingSummary data={MarketingSummary} />
          </div>
        ) : (
          <p>Carregando...</p>
        )}
        <div className={styles['content-grid']}>
          <div className={styles.card}>
            <h2>Faturamento Semanal</h2>
            <svg ref={chartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Análise de Distribuição</h2>
            <svg ref={distributionChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Análise de Gênero</h2>
            <svg ref={genderChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Horários de Pico</h2>
            <svg ref={peakHoursChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Alcance por Dia da Semana</h2>
            <svg ref={reachChartRef}></svg>
          </div>
          <div className={styles.card}>
            <h2>Alcance Médio por Faixa Etária</h2>
            <svg ref={averageReachChartRef}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;