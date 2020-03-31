import React, { Fragment, useEffect, useState } from "react";
import request from "request-promise";
import moment from "moment";
import { jar } from "request";
import { Box } from "ink";
import { findIndex, sortBy } from "lodash";

import { useCV3GetData } from "../src/hooks";
import { Loading, Timestamp } from "../src/components";

function list() {
  const [state, setPath] = useCV3GetData(
    { view: "template_list" },
    {
      javascript_files: { templates: {} },
      other_files: { templates: {} },
      stylesheets: { templates: {} },
      template_list: { html_categories: {}, templates: {} }
    }
  );

  const {
    javascript_files: { templates: rawJavaScript },
    stylesheets: { templates: rawStylesheets },
    template_list: { html_categories: rawCategories, templates: rawTemplates }
  } = state.response;

  const categories = [
    ...Object.keys(rawCategories).map(name => ({
      id: rawCategories[name],
      name
    })),
    { id: "javascript_files", name: "JavaScript Files" },
    { id: "css_stylesheets", name: "CSS Stylesheets" }
  ];

  const allTemplates = { ...rawJavaScript, ...rawStylesheets, ...rawTemplates };

  const templates = sortBy(
    [].concat(
      ...Object.keys(allTemplates).map(name => [
        ...Object.values(allTemplates[name]).map(template => ({
          ...template,
          last_modified: moment(
            template.last_modified,
            "MM-DD-YYYY HH:mm:ss"
          ).unix(),
          categoryID: categories[findIndex(categories, { name })].id
        }))
      ])
    ),
    ["file"]
  );

  return (
    <Fragment>
      {state.isLoading ? (
        <Loading />
      ) : (
        <Box flexDirection="column">
          {templates.map(template => (
            <Box key={template.file}>
              <Box width={40}>{template.file}</Box>
              <Box>
                {moment(template.last_modified, "X").format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Fragment>
  );
}

export default list;
