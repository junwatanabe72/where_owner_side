import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Asset, Proposal } from '../../../types';
import { formatArea, filterProposalsByAsset } from '../../../utils';
import { ProposalSection } from '../proposals';

interface PropertySlideOverProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  proposals: Proposal[];
}

const PropertySlideOver: React.FC<PropertySlideOverProps> = ({
  open,
  onClose,
  asset,
  proposals,
}) => {
  const relatedProposals = useMemo(() => {
    if (!asset) return [];
    return filterProposalsByAsset(proposals, asset.address);
  }, [asset, proposals]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l rounded-l-2xl flex flex-col"
          >
            <div className="h-14 flex items-center justify-between px-4 border-b">
              <div className="font-semibold">物件情報</div>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {asset ? (
                <>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold">{asset.address}</div>
                    <div className="text-slate-600">
                      面積: {formatArea(asset.area)}
                    </div>
                    <div className="text-slate-600">所有者: {asset.owner}</div>
                    <div className="text-slate-600">現況: {asset.status}</div>
                    <div className="text-slate-600">{asset.memo}</div>
                  </div>
                  <ProposalSection asset={asset} proposals={relatedProposals} />
                </>
              ) : (
                <div className="text-sm text-slate-500">
                  物件を選択してください。
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PropertySlideOver;