import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const MarketingPage = () => {
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

  useEffect(() => {
    const fetchRevenueByDay = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/revenue-by-day');
        setMarketingData(response.data);
        if (response.data.length > 0) { drawRevenueChart(response.data); }
      } catch (error) {
        console.error('Erro ao buscar dados de marketing:', error);
        alert('Erro ao buscar dados de marketing. Verifique o console para mais detalhes.');
      }
    };

    const fetchDistributionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/distributions');
        setDistributionData(response.data);
        if (response.data) { drawDistributionChart(response.data); }
      } catch (error) {
        console.error('Erro ao buscar dados de distribuição:', error);
        alert('Erro ao buscar dados de distribuição. Verifique o console para mais detalhes.');
      }
    };

    const fetchGenderData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketing/gender-analysis');
        setGenderData(response.data);
        if (response.data.generos && response.data.ocorrencias) { drawGenderChart(response.data); }
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

    fetchRevenueByDay();
    fetchDistributionData();
    fetchGenderData();
    fetchPeakHoursData();
    fetchReachByDay();
  }, []);

  const drawRevenueChart = (data) => {
    const svg = d3.select(chartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  
    // Limpa o gráfico anterior, se houver
    svg.selectAll('*').remove();
  
    // Ordena os dias da semana em ordem lógica
    const orderedDays = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
    const formattedData = orderedDays.map(day => ({
      dia_semana: day,
      total_faturamento: data.find(d => d.dia_semana === day)?.total_faturamento || 0
    }));
  
    // Escalas
    const x = d3.scaleBand()
      .domain(formattedData.map(d => d.dia_semana))
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.total_faturamento)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    // Adiciona barras ao gráfico
    svg.selectAll('.bar')
      .data(formattedData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.dia_semana))
      .attr('y', d => y(d.total_faturamento))
      .attr('height', d => y(0) - y(d.total_faturamento))
      .attr('width', x.bandwidth())
      .attr('fill', '#69b3a2');
  
    // Adiciona valores brutos acima das barras
    svg.selectAll('.label')
      .data(formattedData)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.dia_semana) + x.bandwidth() / 2)
      .attr('y', d => y(d.total_faturamento) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.total_faturamento.toFixed(2));
  
    // Adiciona eixo X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  
    // Adiciona eixo Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };  

  const drawDistributionChart = (data) => {
    const svg = d3.select(distributionChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Limpa o gráfico anterior, se houver
    svg.selectAll('*').remove();

    // Configurando os dados de distribuição
    if (!data) return;

    const formattedData = [
      { name: 'faturamento_diario', avg: data.faturamento_diario.average, stddev: data.faturamento_diario.stddev },
      { name: 'alcance_instagram', avg: data.alcance_instagram.average, stddev: data.alcance_instagram.stddev },
      { name: 'alcance_facebook', avg: data.alcance_facebook.average, stddev: data.alcance_facebook.stddev },
      { name: 'alcance_tiktok', avg: data.alcance_tiktok.average, stddev: data.alcance_tiktok.stddev },
      { name: 'qtd_clientes', avg: data.qtd_clientes.average, stddev: data.qtd_clientes.stddev },
    ];

    // Escalas
    const x = d3.scaleBand()
      .domain(formattedData.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.avg + d.stddev)]).nice()
      .range([height - margin.bottom, margin.top]);

    // Adiciona barras ao gráfico
    svg.selectAll('.bar')
      .data(formattedData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.avg))
      .attr('height', d => y(0) - y(d.avg))
      .attr('width', x.bandwidth())
      .attr('fill', '#4682b4');

    // Adiciona eixo X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Adiciona eixo Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  const drawGenderChart = (data) => {
    const svg = d3.select(genderChartRef.current);
    const width = 800;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 10;

    // Limpa o gráfico anterior, se houver
    svg.selectAll('*').remove();

    // Configurando os dados de gênero
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

    // Adiciona fatias
    group.selectAll('path')
        .data(pie(formattedData))
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i));

    // Adiciona rótulos
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
      const width = 800;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 50 };

      // Limpa o gráfico anterior, se houver
      svg.selectAll('*').remove();

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
          .padding(0.1);

      const y = d3.scaleLinear()
          .domain([0, 24]).nice() // Ajustando a escala para 24 horas
          .range([height - margin.bottom, margin.top]);

      // Adiciona barras ao gráfico
      svg.selectAll('.bar')
          .data(formattedData)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.dia))
          .attr('y', d => y(parseInt(d.horario_pico?.split(':')[0]) || 0))
          .attr('height', d => y(0) - y(parseInt(d.horario_pico?.split(':')[0]) || 0))
          .attr('width', x.bandwidth())
          .attr('fill', '#2ca02c');

      // Adiciona rótulos em texto nas barras
      svg.selectAll('.label')
          .data(formattedData)
          .enter().append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.dia) + x.bandwidth() / 2)
          .attr('y', d => y(parseInt(d.horario_pico?.split(':')[0]) || 0) - 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .text(d => d.horario_pico || '');

      // Adiciona eixo X
      svg.append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x));

      // Adiciona eixo Y
      svg.append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(24).tickFormat(d => `${d}:00`));
  };

  const drawReachChart = (data) => {
    const svg = d3.select(reachChartRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  
    // Limpa o gráfico anterior, se houver
    svg.selectAll('*').remove();
  
    const { dias, instagram, facebook, tiktok } = data;
  
    if (!dias || !instagram || !facebook || !tiktok) {
      console.error('Dados inválidos:', data);
      return;
    }
  
    // Escalas
    const x = d3.scaleBand()
      .domain(dias)
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max([...instagram, ...facebook, ...tiktok])]).nice()
      .range([height - margin.bottom, margin.top]);
  
    // Adiciona barras para cada plataforma
    ['Instagram', 'Facebook', 'TikTok'].forEach((platform, i) => {
      const platformData = [instagram, facebook, tiktok][i];
      const color = ['#1f77b4', '#ff7f0e', '#2ca02c'][i];
  
      // Desenha as barras
      svg.selectAll(`.bar-${platform.toLowerCase()}`)
        .data(platformData)
        .enter().append('rect')
        .attr('class', `bar-${platform.toLowerCase()}`)
        .attr('x', (d, j) => x(dias[j]) + (i * x.bandwidth()) / 3)
        .attr('y', d => y(d))
        .attr('height', d => y(0) - y(d))
        .attr('width', x.bandwidth() / 3)
        .attr('fill', color);
  
      // Adiciona o nome da rede social rotacionado dentro das barras
      svg.selectAll(`.label-${platform.toLowerCase()}`)
        .data(platformData)
        .enter().append('text')
        .attr('class', `label-${platform.toLowerCase()}`)
        .attr('x', (d, j) => x(dias[j]) + (i * x.bandwidth()) / 3 + x.bandwidth() / 6)
        .attr('y', d => y(d) + (y(0) - y(d)) / 2) // Centraliza verticalmente o texto
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'white')
        .attr('transform', (d, j) => {
          const xPos = x(dias[j]) + (i * x.bandwidth()) / 3 + x.bandwidth() / 6;
          const yPos = y(d) + (y(0) - y(d)) / 2;
          return `rotate(-90, ${xPos}, ${yPos})`; // Rotaciona em torno do centro do texto
        })
        .text(() => platform);
    });
  
    // Adiciona eixo X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(0)') // Mantém os dias da semana sem rotação
      .style('text-anchor', 'middle');
  
    // Adiciona eixo Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };  
  

  return (
    <div>
      <h1>Dados de Marketing</h1>
      {marketingData.length === 0 ? (
        <p>Nenhum dado de marketing encontrado.</p>
      ) : (
        <>
          <h2>Faturamento Semanal</h2>
          <svg ref={chartRef} width="800" height="400"></svg>
        </>
      )}
      {distributionData ? (
        <>
          <h2>Análise de Distribuição</h2>
          <svg ref={distributionChartRef} width="800" height="400"></svg>
        </>
      ) : (
        <p>Carregando dados de distribuição...</p>
      )}
  
      {genderData ? (
        <>
          <h2>Análise de Gênero</h2>
          <svg ref={genderChartRef} width="800" height="400"></svg>
        </>
      ) : (
        <p>Carregando dados de análise de gênero...</p>
      )}
  
      {peakHoursData ? (
        <>
          <h2>Horários de Pico</h2>
          <svg ref={peakHoursChartRef} width="800" height="400"></svg>
        </>
      ) : (
        <p>Carregando dados de horários de pico...</p>
      )}
  
      {reachData ? (
        <>
          <h2>Alcance por Dia da Semana</h2>
          <svg ref={reachChartRef} width="800" height="400"></svg>
        </>
      ) : (
        <p>Carregando dados de alcance...</p>
      )}
    </div>
  );
  
};

export default MarketingPage;
