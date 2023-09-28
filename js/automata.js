const cadena = document.getElementById('input-cadena');
const boton = document.getElementById('btn-cadena');
const resultado = document.getElementById('resultado');
const textoA = document.getElementById('texto');
const borde = document.getElementById('automata'); 



const automata = {
    states: ['q0','q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13'],
    transitions:{  
        q0:{},
        q1:{},
        q2:{},
        q3:{},
        q4:{'-': 'q5'},
        q5:{'0': 'q6'},
        q6:{'0': 'q7'},
        q7:{},
        q8:{'-': 'q12'},
        q9:{},
        q10:{},
        q11:{'-': 'q12'},
        q12:{},
        q13:{},
    },
    initialState: 'q0',
    finalState: ['q13'],
};

for (let i = 'L'.charCodeAt(0); i <= 'P'.charCodeAt(0); i++) {
    const symbol = String.fromCharCode(i);
    console.log(automata.transitions.q0[symbol])
    automata.transitions.q0[symbol] = 'q1';
  }

for (let i = 'G'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
    const symbol = String.fromCharCode(i);
    console.log(automata.transitions.q1[symbol])
    automata.transitions.q1[symbol] = 'q2';
  }
  
for (let i = 'A'.charCodeAt(0); i <= 'E'.charCodeAt(0); i++) {
    const symbol = String.fromCharCode(i);
    console.log(automata.transitions.q1[symbol])
    automata.transitions.q1[symbol] = 'q3';
  }

for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
    const symbol = String.fromCharCode(i);
    console.log(automata.transitions.q2[symbol])
    automata.transitions.q2[symbol] = 'q4';
    automata.transitions.q3[symbol] = 'q4';
    automata.transitions.q12[symbol] = 'q13';
  }

for (let i = 1; i <= 9; i++) {
    const symbol = i.toString();
    automata.transitions.q5[symbol] = 'q9';
    automata.transitions.q7[symbol] = 'q8';
    automata.transitions.q6[symbol] = 'q10';
  }
  
for (let i = 0; i <= 9; i++) {
    const symbol = i.toString();
    automata.transitions.q9[symbol] = 'q10';
    automata.transitions.q10[symbol] = 'q11';
  }
  
  let currentState = automata.initialState;
  let IsAccepted= false


  // Función para actualizar el estado
  function updateState(newState) {
    currentState = newState;
  }

  function setIsAccepted(value){
    IsAccepted = value;
  
  }
  
  const simularCadena = (automata, cadena) => {
    let newState = automata.initialState;
    let steps = [{ state: newState, symbol: '', accepted: false }];
  
    for (let i = 0; i < cadena.length; i++) {
      const symbol = cadena[i];
      if (!automata.transitions[newState][symbol]) {
        // Si el símbolo no está en las transiciones actuales, reiniciar el autómata.
        newState = automata.initialState;
        steps = [{ state: newState, symbol: '', accepted: false }];
        setIsAccepted(false);
      } else {
        newState = automata.transitions[newState][symbol];
        steps.push({ state: newState, symbol, accepted: automata.finalState.includes(newState) });
        setIsAccepted(automata.finalState.includes(newState));
      }
      updateState(newState);
    }
  
    visualizeautomata(steps);
  
    return automata.finalState.includes(newState); // Devuelve true si la cadena es aceptada, false si no lo es
};
  const visualizeautomata = (steps) => {
    // Selecciona el contenedor SVG donde se dibujará el autómata.
    const svg = d3.select('#automata-svg');
  
    // Define las coordenadas de los estados de manera más ordenada.
    const stateCoordinates = {
      q0: { x: 50, y: 200 },
      q1: { x: 150, y: 50 },
      q2: { x: 150, y: 200 },
      q3: { x: 210, y: 50 },
      q4: { x: 250, y: 150 },
      q5: { x: 250, y: 250 },
      q6: { x: 270, y: 200 },
      q7: { x: 300, y: 50 },
      q8: { x: 350, y: 50 },
      q9: { x: 400, y: 150 },
      q10: { x: 450, y: 150 },
      q11: { x: 550, y: 150 },
      q12: { x: 50, y: 250 },
      q13: { x: 540, y: 250 },
    };
  
    // Limpia el SVG para redibujar.
    svg.selectAll('*').remove();
  
    // Verifica si la cadena completa es aceptada.
    const isCompleteAccepted = steps.length > 0 && steps[steps.length - 1].accepted;
  
    // Dibuja estados como círculos y agrega nombres de estados.
    const statesGroup = svg.append('g');
    Object.keys(stateCoordinates).forEach((state) => {
      const { x, y } = stateCoordinates[state];
  
      // Encuentra el estado correspondiente en los pasos.
      const stateStep = steps.find((step) => step.state === state);
  
      // Determina el color del círculo según el estado actual y si la cadena completa es aceptada.
      let circleColor = 'white';
      if (stateStep) {
        if (isCompleteAccepted) {
          circleColor = 'green'; // Si la cadena completa es aceptada, todos los círculos son verdes.
        } else {
          circleColor = stateStep.accepted ? 'green' : 'red';
        }
      }
  
      // Dibuja el círculo.
      statesGroup
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 20)
        .style('fill', circleColor);
  
      // Agrega el nombre del estado como texto dentro del círculo.
      statesGroup
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em') // Ajusta la posición vertical del texto dentro del círculo.
        .text(state);
    });
  
    if (steps) { 
      // Dibuja transiciones como líneas y coloca los símbolos de transición correctamente.
      for (let i = 0; i < steps.length -1 ; i++) {
        const fromState = steps[i].state;
        const toState = steps[i + 1].state;
  
        // Determina si la transición fue exitosa o no.
        const isTransitionSuccessful = toState !== fromState;
  
        // Cambia el color de la línea según si la transición fue exitosa o no.
        const lineColor = isTransitionSuccessful ? 'blue' : '#f87272';
  
        // Dibuja la línea.
        svg
          .append('line')
          .attr('x1', stateCoordinates[fromState].x)
          .attr('y1', stateCoordinates[fromState].y)
          .attr('x2', stateCoordinates[toState].x)
          .attr('y2', stateCoordinates[toState].y)
          .attr('stroke', lineColor);
  
        // Agrega los símbolos de transición después de dibujar las líneas.
        if (steps[i].symbol) {
          // Calcula las coordenadas para el texto de transición como el punto medio entre los estados.
          const textX = (stateCoordinates[fromState].x + stateCoordinates[toState].x) / 2;
          const textY = (stateCoordinates[fromState].y + stateCoordinates[toState].y) / 2;
  
          // Agrega el símbolo de transición como texto en el medio de la línea.
          svg
            .append('text')
            .attr('x', textX)
            .attr('y', textY)
            .text(steps[i+1].symbol)
            .attr('text-anchor', 'middle', 'white')
            .attr('fill', '#ffffff');
  
        }
      }
    }
  }
  

boton.addEventListener('click', function () {
    borde.style.border = 'none'; // Oculta el borde del div
    textoA.innerHTML = ''; // Elimina el contenido del div
    const h2Element = textoA.querySelector('h2'); // Selecciona el elemento h2 dentro del div
    if (h2Element) {
        h2Element.style.display = 'none'; // Oculta el elemento h2 si existe
    }
    const valorcadena = cadena.value.trim(); // Elimina espacios en blanco al inicio y al final
    if (valorcadena !== '') {
      const IsAccepted = simularCadena(automata, valorcadena);
      console.log(IsAccepted)
      if (IsAccepted) {
            resultado.textContent = "La cadena es aceptada por el autómata.";
        } else {
            resultado.textContent = "La cadena no es aceptada por el autómata.";
        }
    } else {

        resultado.textContent = 'El campo está vacío. Por favor, ingresa algo.';
    }
});


