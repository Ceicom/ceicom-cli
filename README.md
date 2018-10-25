# ceicom-cli

> ceicom-cli aligéra o **nosso** desenvolvimento

## Beneficios de usar o `ceicom-cli`

- Velocidade
- Ajuda no manter o padrão de desenvolvimento

## Instalar

```
$ npm install ceicom-cli
```
## API de uso
### new
  
```
$ ceicom new <projectname>
```
Esse comando faz o download do reporitório [`html_boilerplate`](https://github.com/Ceicom/html_boilerplate) do git, instala as dependencias com o `yarn` e deixa oculta as pastas `node_modules` e `arquivos`.

### generate
  
```
$ ceicom generate <type> <name>
```
Esse comando gera um arquivo com base nos arquivos `model` presentes no boilerplate alterando algumas propriedades do arquivo deixando-o certo para o nome passado.

**Tipos disponíveis:**
- `page`
- `template`
- `less`
- `webform`
- `combo`

## Descrições e opções dos tipos do `generate`

### page
Cria um arquivo na pasta `./dev/js` pegando o conteudo do `model.js` da pasta `/pages`.

### template
Cria um arquivo na pasta `./dev/js` pegando o conteudo do `model.js` da pasta `/templates`.

### less
Cria um arquivo na pasta `./dev/less/page/`.

### webform
Cria um arquivo na pasta `./pages` pegando o conteudo do `model.aspx` e `model.aspx.cs` da pasta `/pages`, neste tipo, o nome passado no `generate` irá ser colocado em uma pasta depois da pasta `./pages`, exemplo: `./pages/home/Default.aspx`.

#### options

Nome: `--filename`<br>
Padrão: `Default.aspx`

Altera o nome padrão do arquivo

### combo
Esse carinha foda ai executa todos os outros tipos, criara um arquivo nas pastas `./dev/js/pages`, `./dev/js/templates`, `./dev/less/page` e `./pages`.

## Maintainers

- [Emanoel Queiroz](https://github.com/Dimebag03)
