/*
 * @Author: Russ Zhong 
 * @Date: 2019-02-12 17:45:14 
 * @Last Modified by: Russ Zhong
 * @Last Modified time: 2019-02-17 12:22:07
 */

const expect = require('expect.js');
const { sum } = require('../src');

describe('测试 sum 函数', function() {
  it('返回两数之和', function() {
    expect(sum(1, 2)).to.equal(3);
  });
  it('测试不都为正数的情况', function() {
    expect(sum(-1, 2)).to.equal(0);
  });
});