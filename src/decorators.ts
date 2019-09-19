

export function subscribe<T>(type: new (...args: Array<any>) => T, property: keyof T) {
  return function (target: any, propertyKey: string) {
    const oldOnChangeProvider = target.onChangeProvider;
    target.onChangeProvider = function(_type: any, newValue: any, oldValue: any) {
      if (_type === type) {
        if (oldValue) {
          this.unsubscribe(oldValue[property]);
        }
        if (newValue) {
          let isFirst = true;
          this.subscribe(newValue[property], (value: any) => {
            this[propertyKey] = value;
            if (isFirst) {
              isFirst = false;
            } else {
              this.forceUpdate();
            }
          });
        }
      }
      if (oldOnChangeProvider) {
        oldOnChangeProvider.call(this, _type, newValue, oldValue);
      }
    }
  }
}


export function provider<P>(type: P) {
  return function (target: any, propertyKey: string) {
    const oldOnChangeProvider = target.onChangeProvider;
    target.onChangeProvider = function(_type: any, newValue: any, oldValue: any) {
      if (_type === type) {
        if (oldValue) {
          this[propertyKey] = null;
        }
        if (newValue) {
          this[propertyKey] = newValue;
        }
      }
      if (oldOnChangeProvider) {
        oldOnChangeProvider.call(this, _type, newValue, oldValue);
      }
    };
  }
}