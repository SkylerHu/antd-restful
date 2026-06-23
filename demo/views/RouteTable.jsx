import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import libs from "demo/libs";
import { useLocation, useNavigate } from "react-router";

const {
  RouteBaseTable,
  constants: { ViewType },
} = libs;

const RouteTable = forwardRef(({ viewType = ViewType.TABLE, ...restProps }, ref) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <RouteBaseTable
      ref={ref}
      viewType={viewType}
      restProps={restProps}
      location={location}
      onSearchChange={(search) => {
        navigate(`${location.pathname}${search}`);
      }}
    />
  );
});

RouteTable.displayName = "RouteTable";
RouteTable.propTypes = {
  viewType: PropTypes.oneOf(ViewType.map((o) => o.value)),
  restProps: PropTypes.object,
};
export default RouteTable;
