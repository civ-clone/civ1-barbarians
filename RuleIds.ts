// The ids of this package's rules that another package is expected to name (civ-clone/web-renderer#954), as a rule
//  set that supersedes one does: imported, a rename breaks the other package's build rather than leaving both rules
//  running.

/** A barbarian leader who defends and loses pays the civilization that beat him his ransom, as v474.05. */
export const RANSOM_RULE = 'civ1-barbarians:unit/defeated/ransom';
