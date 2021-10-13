import React, { useEffect } from "react";
import AutoLoadObjectList from "../elements/lists/AutoLoadObjectList";
import { connect, useDispatch } from "react-redux";
import { resetPage } from "../../redux/reducers/pagingSlice";

const Instances = () => {

  const dispatch = useDispatch();

  const onLoadRequest = {
    url: `/instances`,
    method: "GET"
  }

  useEffect(() => {
    dispatch(resetPage());
  }, [dispatch])

    return <div style={{overflow: "auto", height: "inherit"}}>
      <AutoLoadObjectList
        onLoadRequest={onLoadRequest}
        label="INSTANCES"
        timeField={(row) => [row.timestamp]}
        timeFieldLabel="Timestamp"
      />
    </div>
}

const mapState = state => {
  return {
    paging: state.pagingReducer
  }
}

export default connect(mapState)(Instances);
