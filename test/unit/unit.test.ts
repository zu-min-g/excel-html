describe("テストコードサンプル", () => {
  it("Array", () => {
    const arr = []
    arr.push(true)

    expect(arr.length).toStrictEqual(1)
    expect(arr).toStrictEqual([true])
  })
})
