import React, { Suspense } from "react";
import { Tabs } from "antd";
import { useNavigate, useParams } from "react-router";
import ReadView from "./views/ReadView";
import DynamicForm from "./views/StaticForm";
import TableDemo from "./views/TableDemo";
import ListDemo from "./views/ListDemo";
import { detectAntdVersion } from "../src/common/dateUtils";

const JSONForm = React.lazy(() => import("./views/JSONForm"));

export default function Main() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const antdVersion = detectAntdVersion();

  const items = [
    {
      key: "form",
      label: "StaticForm",
      children: <DynamicForm />,
    },
    {
      key: "read",
      label: "ReadView",
      children: <ReadView />,
    },
  ];

  if (antdVersion >= 5) {
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
      destroyInactiveTabPane
      items={items}
      onChange={(key) => {
        navigate(`/${key}`);
      }}
    />
  );
}
