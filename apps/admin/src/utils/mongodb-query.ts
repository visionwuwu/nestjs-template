/**
 *  处理$and条件参数
 * @param queryParams 查询条件参数
 *
 * @author Visionwuwu
 */
export const handle$andArguments = <T = Record<string, unknown>>(
  queryParams: T,
): any[] => {
  const conditions = [];
  Object.keys(queryParams).forEach((field) => {
    const val = queryParams[field];
    if (val !== null || val !== '' || val !== undefined) {
      const type = typeof val;
      const expression = {};
      switch (type) {
        case 'string':
          expression[field] = new RegExp(`${val}.*`, 'gim');
          break;
        case 'object':
          expression[field] = val;
        default:
          expression[field] = val;
          break;
      }
      conditions.push(expression);
    }
  });
  return conditions;
};
