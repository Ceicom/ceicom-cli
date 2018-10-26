# ceicom-cli

> o *ceicom-cli* é uma interface de linha de comando (***CLI - Command Line Interface***) que aligéra e , ao mesmo tempo, ajuda no nosso desenvolvimento utilizando de comandos para a criação de projetos e arquivos.

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

#### options

Nome: `--template`<br>

Faz com que seja criado o template com base nas informações passadas para o comando page

### template
Cria um arquivo na pasta `./dev/js` pegando o conteudo do `model.js` da pasta `/templates`.

### less
Cria um arquivo na pasta `./dev/less/page/`.

### webform
Cria um arquivo na pasta `./pages` pegando o conteudo do `model.aspx` e `model.aspx.cs` da pasta `/pages`, neste tipo, o nome passado no `generate` irá ser colocado em uma pasta depois da pasta `./pages`, exemplo: `./pages/home/Default.aspx`.

#### options

Nome: `--filename=<filename>`<br>
Padrão: `Default.aspx`

Altera o nome padrão do arquivo

### combo
Esse carinha foda ai executa todos os outros tipos, criara um arquivo nas pastas `./dev/js/pages`, `./dev/js/templates`, `./dev/less/page` e `./pages`.

## Mantenedores

- [Emanoel Queiroz](https://github.com/Dimebag03)
