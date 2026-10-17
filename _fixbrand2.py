import io

# 1) translations.ts : jeton {brand} dans les valeurs podcast (5 langues)
p = 'src/lib/i18n/translations.ts'
s = io.open(p, encoding='utf-8').read()
pairs = [
  ('gold: "EINSOF.",', 'gold: "{brand}.",'),
  ('title: "The EINSOF"', 'title: "The {brand}"'),
  ('gold: "de EINSOF.",', 'gold: "de {brand}.",'),
  ('title: "EINSOF"\n    gold: "播客。"', 'title: "{brand}"\n    gold: "播客。"'),
  ('title: "Der EINSOF-"', 'title: "Der {brand}-"'),
]
for old, new in pairs:
    assert s.count(old) == 1, f'introuvable: {old!r} x{s.count(old)}'
    s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('translations.ts : 5 valeurs podcast migrees vers {brand}')

# 2) contenus pages : apropos.ts, secteur-details.ts, zones.ts -> {brand}
for f in ['src/lib/pages-content/apropos.ts', 'src/lib/pages-content/secteur-details.ts', 'src/lib/pages-content/zones.ts']:
    s = io.open(f, encoding='utf-8').read()
    n = s.count('EINSOF')
    s = s.replace('EINSOF', '{brand}')
    io.open(f, 'w', encoding='utf-8', newline='\n').write(s)
    print(f'{f} : {n} occurrences -> {{brand}}')
