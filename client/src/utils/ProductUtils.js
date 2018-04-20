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
  splitProductsByGroups(productMap = {}) {
    const productsRaw = Object.values(productMap);
    const asGroups = toPairs(groupBy(productsRaw, "group_id")).map(it => ({
      groupId: it[0] || "Unassigned to group",
      products: it[1]
    }));

    return asGroups;
  }
};

export default ProductUtils;