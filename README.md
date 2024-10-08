# Desafio laurascotelari 2024
Desafio desenvolvido para o processo seletivo da StartDB.

# Descrição do desafio

Olá! Você foi contratado para ajudar na organização de um zoológico. Sua missão será construir a lógica para indicar os recintos onde novos animais se sintam confortáveis.

## RECINTOS EXISTENTES

O zoológico possui os seguintes recintos disponíveis:

| Número | Bioma           | Tamanho Total | Animais Existentes |
|--------|-----------------|----------------|--------------------|
| 1      | Savana          | 10             | 3 macacos          |
| 2      | Floresta        | 5              | Vazio              |
| 3      | Savana e Rio    | 7              | 1 gazela           |
| 4      | Rio             | 8              | Vazio              |
| 5      | Savana          | 9              | 1 leão             |

## ANIMAIS

O zoológico só está habilitado a tratar dos animais abaixo. A tabela mostra o espaço que cada indivíduo ocupa e em quais biomas se adapta:

| Espécie     | Tamanho | Bioma            |
|-------------|---------|------------------|
| Leão        | 3       | Savana           |
| Leopardo    | 2       | Savana           |
| Crocodilo   | 3       | Rio              |
| Macaco      | 1       | Savana ou Floresta|
| Gazela      | 2       | Savana           |
| Hipopótamo  | 4       | Savana ou Rio    |

## REGRAS PARA ENCONTRAR UM RECINTO

- Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo.
- Animais carnívoros devem habitar somente com a própria espécie.
- Animais já presentes no recinto devem continuar confortáveis com a inclusão do(s) novo(s).
- Hipopótamo(s) só tolera(m) outras espécies estando num recinto com Savana e Rio.
- Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie.
- Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado.
- Não é possível separar os lotes de animais nem trocar os animais que já existem de recinto (eles são muito apegados!). Por exemplo, se chegar um lote de 12 macacos, não é possível colocar 6 em 2 recintos.

## Solução Desenvolvida
Com o intuito de resolver o problema proposto, foram criadas mais duas classes, Animal e Enclosure, além de dois arquvios JSON contendo as informações relevantes dos recintos disponíveis e dos possíveis animais. Além disso, para garantir uma boa cobertura, foram elaborados mais 4 casos de teste. 

