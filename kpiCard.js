// Usamos la librería de ayuda de Google (Data Studio Community Component)
var dscc = require('dscc');
var d3 = require('d3');

// Esta función se ejecuta cada vez que los datos o el estilo cambian
function drawViz(data) {
  // Limpia el contenido anterior
  document.body.innerHTML = '';

  // --- 1. Obtener Datos y Estilos ---
  var kpiValue = data.tables.DEFAULT[0].kpiMetric[0];
  var comparisonValue = data.tables.DEFAULT[0].kpiComparison ? data.tables.DEFAULT[0].kpiComparison[0] : null;

  var title = data.style.titleText.value || 'Título';
  var posColor = data.style.positiveColor.value.color;
  var negColor = data.style.negativeColor.value.color;

  // --- 2. Calcular la Comparación ---
  var comparisonText = '';
  var comparisonColor = '#000'; // Color por defecto
  var icon = '';

  if (comparisonValue !== null) {
    var percentChange = ((kpiValue - comparisonValue) / comparisonValue);
    var formattedPercent = d3.format('.1%')(percentChange); // Formato: +12.5%

    if (percentChange > 0) {
      comparisonText = '↑ ' + formattedPercent;
      comparisonColor = posColor;
    } else {
      comparisonText = '↓ ' + formattedPercent;
      comparisonColor = negColor;
    }
  }

  // --- 3. Crear el HTML ---
  // Creamos la tarjeta (el contenedor principal)
  var card = document.createElement('div');
  card.className = 'kpi-card';

  // Creamos el título
  var titleElement = document.createElement('h3');
  titleElement.className = 'kpi-title';
  titleElement.textContent = title;

  // Creamos el valor principal
  var valueElement = document.createElement('h1');
  valueElement.className = 'kpi-value';
  // Formatea el número (ej. €21,036) - esto es una simplificación
  valueElement.textContent = '€' + kpiValue.toLocaleString('es-ES');

  // Creamos el valor de comparación
  var comparisonElement = document.createElement('p');
  comparisonElement.className = 'kpi-comparison';
  comparisonElement.textContent = comparisonText;
  comparisonElement.style.color = comparisonColor;

  // Añadimos los elementos a la tarjeta
  card.appendChild(titleElement);
  card.appendChild(valueElement);
  card.appendChild(comparisonElement);

  // --- 4. Añadir Estilos CSS ---
  // Creamos una etiqueta <style> y la añadimos al body
  var styleElement = document.createElement('style');
  styleElement.innerHTML = `
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      margin: 0;
    }
    .kpi-card {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 12px; /* Esquinas redondeadas */
      box-shadow: 0 4px 12px rgba(0,0,0,0.05); /* Sombra */
      text-align: center;
      width: 90%;
    }
    .kpi-title {
      font-size: 16px;
      color: #666;
      margin: 0 0 5px 0;
    }
    .kpi-value {
      font-size: 36px;
      font-weight: bold;
      color: #222;
      margin: 0 0 5px 0;
    }
    .kpi-comparison {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
    }
  `;
  document.head.appendChild(styleElement);

  // Añadimos la tarjeta al cuerpo del documento
  document.body.appendChild(card);
}

// Registra la visualización con Looker Studio
dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
