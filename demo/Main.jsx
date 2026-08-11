import React, { Suspense } from "react";
import { Tabs } from "antd";
import { useNavigate, useParams } from "react-router";
import ReadView from "./views/ReadView";
import StaticForm from "./views/StaticForm";
import TableDemo from "./views/TableDemo";
import ListDemo from "./views/ListDemo";
import { isAntd5Plus } from "../src/common/versionUtil";

const JSONForm = React.lazy(() => import("./views/JSONForm"));

export default function Main() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const items = [
    {
      key: "form",
      label: "StaticForm",
      children: <StaticForm />,
    },
    {
      key: "read",
      label: "ReadView",
      children: <ReadView />,
    },
  ];

  if (isAntd5Plus) {
    items.push({
      key: "jsonform",
      label: "JSONForm",
      children: (
        <Suspense fallback={<div>Loading...</div>}>
          <JSONForm />
        </Suspense>
      ),
    });
  }

  items.push(
    {
      key: "table",
      label: "TableDemo & RouteTable",
      children: <TableDemo />,
    },
    {
      key: "list",
      label: "ListDemo",
      children: <ListDemo />,
    }
  );

  return (
    <Tabs
      activeKey={tab || "form"}
      {...(isAntd5Plus ? { destroyOnHidden: true } : { destroyInactiveTabPane: true })}
      items={items}
      onChange={(key) => {
        navigate(`/${key}`);
      }}
    />
  );
}
