import {configureStore} from '@reduxjs/toolkit'
import datasetSelectReducer from "./reducers/datasetSelectSlice";
import rightPaperReducer from "./reducers/rightPaperSlice";
import notificationReducer from "./reducers/notificationSlice";
import warningIconReducer from "./reducers/warningIconSlice";
import alertReducer from "./reducers/alertSlice";
import progressReducer from "./reducers/progressSlice";
import eventDataGridReducer from "./reducers/eventDataGridSlice";
import uqlReducer from "./reducers/uqlSlice";
import pagingReducer from "./reducers/pagingSlice";
import iconReducer from "./reducers/iconSlice";

export default configureStore({
        reducer: {
            datasetSelectReducer,
            rightPaperReducer,
            notificationReducer,
            progressReducer,
            warningIconReducer,
            alertReducer,
            eventDataGridReducer,
            uqlReducer,
            pagingReducer,
            iconReducer,
        }
    }
);
