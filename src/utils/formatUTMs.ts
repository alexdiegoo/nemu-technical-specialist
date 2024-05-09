export const formartUTMs = (param: string | Array<string>) => {
    if (Array.isArray(param)) {
      return param[0];
    }
  
    return param;
  };
  
  export const preventAnotherSeparatorsThanPipe = (param: string) => {
    if (!param) return param;
  
    const possibleSeparators = ['zzzzz', 'xxxxx'];
  
    for (const separator of possibleSeparators) {
      if (param.includes(separator)) {
        const parts = param.split(separator);
        param = parts[0];
      }
    }
  
    return param;
  }
  
  export const parseUtmContent = (param: string,
    divisor = "|",
  ) => {
    if (!param) return { content: param };
  
    const content = param.split(divisor);
  
    if (content.length <= 1) {
      return { content: param };
    } else {
      const term = content.length > 2 ? content.pop() : null;
      return {
        content: content.join(divisor),
        term: term,
      };
    }
  };
  
  
  export const isUtmTermFromTracking = (term?: string) => {
    if (!term) return false;
  
    const [prefix, sessionId] = term.split("_");
  
    if (!prefix || prefix !== "nemu" || !sessionId) {
      return false;
    }
  
    return true;
  };