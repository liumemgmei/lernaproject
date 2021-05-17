import { runInAction } from 'mobx';

// mobx store 自动loading修饰器
export const loading = function (...arg: any) {
  const [, name, descriptor] = arg;
  const { value } = descriptor;

  descriptor.value = async function (...args: any) {
    try {
      runInAction(() => {
        this.loadings = {
          ...this.loadings,
          [name]: true,
        };
      });
      await value.apply(this, args);
    } finally {
      runInAction(() => {
        this.loadings = {
          ...this.loadings,
          [name]: false,
        };
      });
    }
  };
};