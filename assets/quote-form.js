// Secondary-page quote forms use the same endpoint as the homepage.
(function () {
  var loaded = Date.now();
  document.querySelectorAll('form[data-quote-form]').forEach(function (form) {
    var button = form.querySelector('button[type="submit"]');
    var status = form.querySelector('[data-quote-status]');
    var pending = false;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      var elapsed = Date.now() - loaded;
      if (elapsed < 3000 || elapsed > 3600000) {
        status.textContent = 'Please wait a few seconds, then submit again.';
        loaded = Date.now();
        return;
      }
      var data = Object.fromEntries(new FormData(form));
      data.name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim();
      data.property_size = data.acreage || '';
      data._elapsed = String(elapsed);
      var label = button.textContent;
      pending = true;
      button.disabled = true;
      button.textContent = 'Sending…';
      status.textContent = '';
      try {
        var response = await fetch('/api/quote', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        var result = await response.json();
        if (!response.ok || !result || result.ok !== true) {
          throw new Error(result && result.error || 'Could not send your request. Please try again or call us.');
        }
        window.location.assign('/thankyou.html');
      } catch (error) {
        status.textContent = error.message || 'Network error. Please try again or call us.';
        pending = false;
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
})();
