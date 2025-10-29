
  
    (function(){
      const expressionEl = document.getElementById('expression');
      const resultEl = document.getElementById('result');
      const keys = document.querySelectorAll('button.key');

      let expr = '';

      function sanitizeForEval(s){
        // Allow digits, whitespace, parentheses, decimal point, and operators + - * /
        // Remove unicode operator characters if present (like ×, ÷)
        s = s.replace(/[×x×]/g, '*').replace(/[÷÷]/g, '/');
        // strip any forbidden characters
        if(/[^0-9+\-*/().\s]/.test(s)) return null;
        return s;
      }

      function compute(s){
        const safe = sanitizeForEval(s);
        if(safe === null) return {ok:false};
        try{
          // eslint-disable-next-line no-eval
          const value = eval(safe);
          if(typeof value === 'number' && isFinite(value)) return {ok:true, value};
          return {ok:false};
        }catch(e){
          return {ok:false};
        }
      }

      function updateDisplays(){
        expressionEl.textContent = expr || '0';
        const r = compute(expr || '0');
        if(r.ok){
          // show short & clean formatting
          resultEl.textContent = Number.isInteger(r.value) ? String(r.value) : String(parseFloat(r.value.toFixed(10)).toString());
        }else{
          resultEl.textContent = "—";
        }
      }

      function append(value){
        // prevent multiple leading zeros like "00"
        expr = expr + value;
        updateDisplays();
      }

      function clearAll(){ expr = ''; updateDisplays(); }
      function backspace(){ expr = expr.slice(0,-1); updateDisplays(); }
      function evaluateNow(){
        const r = compute(expr || '0');
        if(r.ok){ expr = String(r.value); updateDisplays(); }
        else { resultEl.textContent = 'Error'; }
      }

      keys.forEach(btn => {
        btn.addEventListener('click', ()=>{
          const v = btn.getAttribute('data-value');
          const action = btn.getAttribute('data-action');
          if(action === 'clear') clearAll();
          else if(action === 'back') backspace();
          else if(action === 'equals') evaluateNow();
          else if(v) append(v);
        });
      });

      // Keyboard support
      window.addEventListener('keydown', (ev)=>{
        const k = ev.key;
        if((/^[0-9]$/.test(k)) || ['+','-','*','/','(',')','.'].includes(k)){
          append(k);
          ev.preventDefault();
        }else if(k === 'Enter' || k === '='){
          evaluateNow();
          ev.preventDefault();
        }else if(k === 'Backspace'){
          backspace();
          ev.preventDefault();
        }else if(k === 'Escape'){
          clearAll();
          ev.preventDefault();
        }
      });

      // initialize
      updateDisplays();

      // Accessibility: allow clicking on screen to focus keyboard actions (for some devices)
      expressionEl.addEventListener('click', ()=>{ /*noop*/ });

    })();
  