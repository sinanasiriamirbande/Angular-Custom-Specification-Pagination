export class SpecificationModel {
  limit?: any;
  skip?: any;
  searchKeyword?: any;
}

export interface PageEvent {
  currentIndex: any,
  length?: any,
  pageSize: any,
}

export class Specification {
  
  public specificationModel: SpecificationModel = {
    limit: 10,
    skip: 0,
    searchKeyword: {}
  };
  public pageEvent: PageEvent = {
    currentIndex: 0,
    pageSize: 10
  };

  public setPageDetailData(res) {
    this.pageEvent.length = res.limit;
    this.pageEvent.currentIndex = res.skip / res.limit;
    this.pageEvent.length = res.total;
  }

  public generateSpecificationString() {

    // skip and limit can have different names
    let pagingParam = '?skip=' + this.specificationModel.skip + '&limit=' + this.specificationModel.limit;
    if (this.specificationModel.searchKeyword && this.specificationModel.searchKeyword != '') {
      Object.keys(this.specificationModel.searchKeyword).forEach(key => {
        if (this.specificationModel.searchKeyword[key] !== null && this.specificationModel.searchKeyword[key] !== '') {
          pagingParam = pagingParam + '&' + key + '=' + this.specificationModel.searchKeyword[key];
        }
      });
      return pagingParam;
    }
    return pagingParam;
  }
}

