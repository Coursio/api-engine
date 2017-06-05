'use strict';


const { printSchema: graphQLPrintSchema, } = require('graphql');
const { render } = require('mustache');

const PRINT_HTML_FILE = `${__dirname}/print.mustache`;
const { fs: { readFile } } = require('../../../../utilities');


const printSchema = async function (schema) {
  const data = {
    printedSchema: graphQLPrintSchema(schema).trim(),
    prismVersion: '1.6.0',
  };
  const htmlFile = await readFile(PRINT_HTML_FILE, { encoding: 'utf-8' });
  const htmlString = render(htmlFile, data);
  return htmlString;
};


module.exports = {
  printSchema,
};
