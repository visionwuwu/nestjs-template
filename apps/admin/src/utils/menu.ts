/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(
  data: any[],
  id = 'id',
  pid = 'parentId',
  addFields?: { [name: string]: any },
) {
  const res = [];
  const temp: any = {};
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i];
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = [];
      }
      if (typeof addFields === 'object') {
        Object.keys(addFields).forEach((key) => {
          data[k][key] = data[k][addFields[key]];
        });
      }
      temp[data[k][pid]]['children'].push(data[k]);
    } else {
      if (typeof addFields === 'object') {
        Object.keys(addFields).forEach((key) => {
          data[k][key] = data[k][addFields[key]];
        });
      }
      res.push(data[k]);
    }
  }
  return res;
}
