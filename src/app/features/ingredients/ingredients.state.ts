// import {createActionGroup, createFeature, createReducer, emptyProps, on} from '@ngrx/store';
// import {PaginationInfo} from '../../common/models';
//
// type IngredientsState = {
//   filter: {
//     name: string | null,
//     category: string | null,
//   }
//   pagination: PaginationInfo,
// };
//
// const initialState: IngredientsState = {
//   filter: {
//     name: null,
//     category: null,
//   },
//   pagination: {
//     page: 1,
//     totalPages: null,
//     itemsPerPage: 20,
//   },
// }
//
// export const ingredientsState = createFeature({
//   name: 'Ingredients',
//   reducer: createReducer(
//     initialState,
//     on(IngredientsActions.pageOpened, (state) => {}),
//   ),
// });
//
// export const IngredientsActions = createActionGroup({
//   source: "Ingredients Page",
//   events: {
//     pageOpened: emptyProps()
//   },
// });
