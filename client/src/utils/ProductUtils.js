import groupBy from 'lodash.groupby';
import toPairs from 'lodash.topairs';


export const ProductUtils = {

  /**
   *
   * @param productMap
   * @returns {[
   *  { groupId, products: [{ product1 }, { product2 }] }
   * ]}
   */
  splitProductsByGroups(productMap = {}, showTransferring) {
    const noGroup = 'Unassigned to group';

    return toPairs(groupBy(Object.values(productMap), 'group_id'))
      .filter(it => {
        if (showTransferring) {
          return it[0] && it[1].every(p => p.transferring);
        }

        return !it[1].some(p => p.transferring)
      })
      .map(it => ({
        groupId: it[0] || noGroup,
        products: it[1]
      }))
      .sort((l, r) => {
        if (l.groupId === noGroup) {
          return 1;
        }

        if (r.groupId === noGroup) {
          return -1;
        }

        return l.groupId.localeCompare(r.groupBy);
      });
  }
};

export default ProductUtils;