/**
 * Yaml parser
 */

import { load } from "js-yaml";

export const loadYamlFile = async() => {
  let result = null;
  await fetch('dummy.yaml')
    .then((response) => response.text())
    .then((yamlString) => load(yamlString))
    .then((data) => result=data)
    .catch((e) => console.log(e));
return result;
};
