# Cloudclapp

## Wireframes & Visual Designs

- The project's original Frontend-designed wireframes can be found on [Axure](https://chvrbf.axshare.com/#id=lhvnvv).
- The project's current visual designs and assets are available on [Figma](https://www.figma.com/file/sMosNFnc2fCG7rrxp5Y2pQ/Ubiqube).
  - Let a member of the MSA 2 UI team know if you need access

## Import components from msa2-ui

Cloudclapp is the 2nd product for UBiqube and we changed [this repository](https://github.com/ubiqube/msa2-ui) as monorepo to have two packages at some point.  
With that historical reason, we import many components from `src/packages/msa2-ui`.  

Here is some conventions that we need to be careful when we import something from msa2-ui.

### Things we should not include
If you import these files from msa2-ui, it locally works fine but it will give you a blank page after building docker image.  
Even if you do not use the feature, **do not let them be in the scope**.
- output from redux-toolkit  
  - eg. msa2-ui/src/store/*
- execute i18n function
  - eg. msa2-ui/src/localisation/i18n.js

#### Safe list
Something we can import
- msa2-ui/src/api/*
- msa2-ui/src/assets/*
- msa2-ui/src/component/\*/*.index
  - *Only when exported per directory.
- msa2-ui/src/services/*
- msa2-ui/src/utils/*

#### Black list
Directories we never should import from
- msa2-ui/src/store/*
- msa2-ui/src/routes/*

### License

© Copyright UBiqube ltd.
