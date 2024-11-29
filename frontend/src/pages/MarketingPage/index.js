import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import axios from 'axios';
import styles from './MarketingPage.module.css'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const MarketingPage = () => {
  const { userType } = useParams();
  const [activeButton, setActiveButton] = useState('marketing');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null);

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
        alert('Erro ao buscar dados de marketing. Verifique o console para mais detalhes.');
      }
    };

    const fetchDistributionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/distributions');
        console.log('Dados de distribuição recebidos:', response.data);
        setDistributionData(response.data);
        if (response.data.length > 0) {
          drawDistributionChart(response.data, distributionChartRef.current);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de distribuição:', error);
        alert('Erro ao buscar dados de distribuição. Verifique o console para mais detalhes.');
      }
    };    

    const fetchGenderData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/gender-analysis');
        setGenderData(response.data);
        if (response.data.length > 0) {
          drawGenderChart(response.data, genderChartRef.current);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de análise de gênero:', error);
        alert('Erro ao buscar dados de análise de gênero. Verifique o console para mais detalhes.');
      }
    };

    const fetchPeakHoursData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/peak-hours');
        setPeakHoursData(response.data);
        if (response.data.dias && response.data.horarios) { drawPeakHoursChart(response.data); }
      } catch (error) {
        console.error('Erro ao buscar dados de horários de pico:', error);
        alert('Erro ao buscar dados de horários de pico. Verifique o console para mais detalhes.');
      }
    };

    const fetchReachByDay = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/reach-by-day');
        setReachData(response.data);
        if (response.data) drawReachChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de alcance diário:', error);
        alert('Erro ao buscar dados de alcance diário. Verifique o console para mais detalhes.');
      }
    };

    const fetchAverageReachData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/average-reach');
        setAverageReachData(response.data);
        if (response.data) drawAverageReachChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de alcance médio por faixa etária:', error);
        alert('Erro ao buscar dados de alcance médio por faixa etária. Verifique o console para mais detalhes.');
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
  
    // Define o gradiente no SVG
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
  
    // Adicionar as barras
    formattedData.forEach((d, i) => {
      const barWidth = x.bandwidth();
      const barHeight = y(0) - y(d.total_faturamento);
      const radius = 20;
  
      // Parte arredondada no topo
      svg.append('rect')
        .attr('x', x(d.dia_semana))
        .attr('y', y(d.total_faturamento) + 10)
        .attr('height', Math.min(barHeight, radius)) // Altura do topo arredondado
        .attr('width', barWidth)
        .attr('rx', radius) // Aplica o arredondamento no topo
        .attr('fill', '#FF1A66');
  
      // Parte retangular para a base
      svg.append('rect')
        .attr('x', x(d.dia_semana))
        .attr('y', y(d.total_faturamento) + Math.min(barHeight, radius)) // Começa logo abaixo da parte arredondada
        .attr('height', barHeight - Math.min(barHeight, radius)) // Altura restante
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
  
    // Add X axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text('Dia da Semana');
  
    // Add Y axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 6)
      .attr('x', -height / 2.25)
      .text('Faturamento (R$)');
  };
  
  const drawDistributionChart = (data, svgElement) => {
    console.log('Iniciando a criação do gráfico de distribuição...');
    console.log('Dados recebidos para distribuição:', data);
  
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
  
    const width = svgElement.clientWidth || 600; // Largura padrão
    const height = svgElement.clientHeight || 300; // Altura padrão
    console.log('Dimensões do SVG:', { width, height });
  
    const margin = { top: 30, right: 30, bottom: 60, left: 70 };
  
    // Converter dados para um array adequado para plotagem
    const formattedData = Object.keys(data).map(key => ({
      name: key,
      average: parseFloat(data[key].average),
      stddev: parseFloat(data[key].stddev),
    }));
    console.log('Dados formatados:', formattedData);
  
    // Configurar escalas
    const x = d3.scaleBand()
      .domain(formattedData.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.average + d.stddev)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    // Adicionar barras ao gráfico
    svg.selectAll('.bar')
      .data(formattedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.average))
      .attr('height', d => y(0) - y(d.average))
      .attr('width', x.bandwidth())
      .attr('fill', '#4682b4');
  
    console.log('Barras adicionadas.');
  
    // Adicionar linhas de desvio padrão como "error bars"
    svg.selectAll('.error-line')
      .data(formattedData)
      .enter()
      .append('line')
      .attr('class', 'error-line')
      .attr('x1', d => x(d.name) + x.bandwidth() / 2)
      .attr('x2', d => x(d.name) + x.bandwidth() / 2)
      .attr('y1', d => y(d.average + d.stddev))
      .attr('y2', d => y(d.average - d.stddev))
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
    console.log('Linhas de erro adicionadas.');
  
    // Adicionar eixo X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    console.log('Eixo X adicionado.');
  
    // Adicionar eixo Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  
    console.log('Eixo Y adicionado.');
  
    // Adicionar título
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('font-size', '16px')
      .text('Distribuição das Variáveis');
  
    console.log('Gráfico finalizado.');
  };
  
  
  const drawGenderChart = (data, svgElement) => {
    const svg = d3.select(genderChartRef.current);
    svg.selectAll('*').remove();

    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const radius = Math.min(width, height) / 2 - 20;

    if (!data) return;

    const pie = d3.pie().value(d => d.ocorrencias);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

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
      .attr('fill', (d, i) => color(i));

    group.selectAll('text')
      .data(pie(formattedData))
      .enter().append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => `${d.data.genero}: ${d.data.ocorrencias}`);
  };

  const drawPeakHoursChart = (data) => {
    const svg = d3.select(peakHoursChartRef.current);
    svg.selectAll('*').remove();

    const svgElement = svg.node();
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };

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

    // Define o gradiente no SVG
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
        .each(function(d) {
            const barGroup = d3.select(this);

            const baseHeight = y(0) - y(parseInt(d.horario_pico?.split(':')[0]) || 0);
            const barWidth = x.bandwidth();
            const radius = 20;

            // Parte arredondada no topo
            barGroup.append('rect')
                .attr('x', x(d.dia))
                .attr('y', y(parseInt(d.horario_pico?.split(':')[0]) || 0) + 10)
                .attr('width', barWidth)
                .attr('height', Math.min(baseHeight, radius)) // Altura do topo arredondado
                .attr('rx', radius) // Aplica o arredondamento no topo
                .attr('fill', '#FF1A66');

            // Parte retangular para a base
            barGroup.append('rect')
                .attr('x', x(d.dia))
                .attr('y', y(parseInt(d.horario_pico?.split(':')[0]) || 0) + Math.min(baseHeight, radius))
                .attr('height', baseHeight - Math.min(baseHeight, radius)) // Altura restante
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

    // Adicionar rótulo para o eixo X e Y
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
        .text('Horário Pico');
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
  
    // Adicionando as barras
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
  
    // Adicionando as legendas abaixo do gráfico
    const legendData = [
      { platform: 'Instagram', color: '#ED1164', logo: 'instagram_logo.svg' },
      { platform: 'Facebook', color: '#FF9FBA', logo: 'facebook_logo.svg' },
      { platform: 'TikTok', color: '#500124', logo: 'tiktok_logo.svg' }
    ];
  
    const legend = svg.selectAll('.legend')
      .data(legendData)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${i * 120 + margin.left}, ${height - margin.bottom + 30})`);
  
    // Adicionando a logo à esquerda do círculo
    legend.append('image')
      .attr('x', 35)  // Ajuste a posição da imagem (à esquerda da legenda)
      .attr('y', 10)  // Ajuste para posicionar a logo ligeiramente acima
      .attr('width', 20)  // Tamanho da logo
      .attr('height', 20)
      .attr('xlink:href', d => `/images/${d.logo}`);
  
    // Adicionando o círculo no canto superior direito da logo
    legend.append('circle')
      .attr('r', 2.5)
      .attr('cx', 60)  // Ajuste para posicionar o círculo no lado direito da logo
      .attr('cy', 10)  // Ajuste para posicionar o círculo acima da logo
      .attr('fill', d => d.color);
  
    // Adicionando o texto (nome da plataforma) centralizado com a logo
    legend.append('text')
      .attr('x', 70)  // Posição do texto à direita da logo
      .attr('y', 25)  // Ajuste para centralizar verticalmente com a logo
      .attr('font-size', '12px')
      .attr('fill', '#000')
      .text(d => d.platform);
  
    // Adicionando os eixos
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(0)')
      .style('text-anchor', 'middle');
  
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(Math.ceil(d3.max([...instagram, ...facebook, ...tiktok]) / 10000)));  // Aqui está a alteração
  };
  
  
  const drawAverageReachChart = (data) => {
    const svg = d3.select(averageReachChartRef.current);
    svg.selectAll('*').remove();

    const svgElement = svg.node();
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const platforms = ['instagram', 'facebook', 'tiktok'];
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c'];

    platforms.forEach((platform, i) => {
      const platformData = data[platform];
      const x = d3.scaleBand()
        .domain(platformData.map(d => d[`idade_${platform}`]))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(platformData, d => d[`alcance_${platform}`])])
        .range([height - margin.bottom, margin.top]);

      svg.append('g')
        .selectAll(`.bar-${platform}`)
        .data(platformData)
        .enter().append('rect')
        .attr('class', `bar-${platform}`)
        .attr('x', d => x(d[`idade_${platform}`]) + i * (x.bandwidth() / platforms.length))
        .attr('y', d => y(d[`alcance_${platform}`]))
        .attr('height', d => y(0) - y(d[`alcance_${platform}`]))
        .attr('width', x.bandwidth() / platforms.length)
        .attr('fill', colors[i]);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    });
  };

  const handleCardClick = (chartType) => {
    setActiveChart(chartType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveChart(null);
  };

  const ModalContent = ({ activeChart, data }) => {
    const modalChartRef = useRef();

    useEffect(() => {
      if (modalChartRef.current) {
        switch (activeChart) {
          case 'revenue':
            drawRevenueChart(data.marketingData, modalChartRef.current);
            break;
          case 'distribution':
            drawDistributionChart(data.distributionData, modalChartRef.current);
            break;
          case 'gender':
            drawGenderChart(data.genderData, modalChartRef.current);
            break;
          case 'peakHours':
            drawPeakHoursChart(data.peakHoursData, modalChartRef.current);
            break;
          case 'reach':
            drawReachChart(data.reachData, modalChartRef.current);
            break;
          case 'averageReach':
            drawAverageReachChart(data.averageReachData, modalChartRef.current);
            break;
          default:
            break;
        }
      }
    }, [activeChart, data]);

    return (
      <div className={styles.modalChart}>
        <svg ref={modalChartRef} width="100%" height="100%"></svg>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar activeButton={activeButton} setActiveButton={setActiveButton} userType={userType} />
      </div>
      <div className={styles['main-content']}>
        <div className={styles.header}>
          <Header title="Marketing" />
        </div>
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
