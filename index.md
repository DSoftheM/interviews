# Вопросы с собеседований

{% assign questions = site.pages | where_exp: "p", "p.path contains 'questions/'" %}

{% for page in questions %}
{% assign parts = page.path | remove: 'questions/' | split: '/' %}
{% assign depth = parts | size %}

- {{ parts | join: ' / ' | replace: '.md', '' | replace: '-', ' ' }}  
  👉 [Открыть]({{ page.url }})

{% endfor %}
