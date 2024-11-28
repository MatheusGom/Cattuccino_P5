import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const MarketingPage = () => {
  const [marketingData, setMarketingData] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/revenue-by-day');
        console.log('Dados de Marketing recebidos:', response.data);
        setMarketingData(response.data);
        drawChart(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de marketing:', error);
        alert('Erro ao buscar dados de marketing. Verifique o console para mais detalhes.');
      }
    };

    fetchMarketingData();
  }, []); // Array vazio para executar o efeito apenas uma vez

  const drawChart = (data) => {
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

    // Adiciona eixo X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform')
      .style('text-anchor', 'end');

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
    </div>
  );
};

export default MarketingPage;
